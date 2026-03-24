/**
 * rate-limit.ts - Rate limiting en memoria por llave
 */
type Entry = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Entry>();
const CLEANUP_INTERVAL_MS = 60_000; // limpiar cada 60s
let lastCleanup = Date.now();

function nowMs(): number {
  return Date.now();
}

function cleanupIfNeeded(current: number): void {
  if (current - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = current;
  for (const [key, entry] of buckets.entries()) {
    if (entry.resetAt <= current) {
      buckets.delete(key);
    }
  }
}

export function getClientIp(request: Request): string {
  const trustProxyHeaders = process.env.TRUST_PROXY_HEADERS === 'true';

  if (trustProxyHeaders) {
    const xff = request.headers.get('x-forwarded-for');
    if (xff) {
      const [first] = xff.split(',');
      if (first?.trim()) return first.trim();
    }
    const realIp = request.headers.get('x-real-ip');
    if (realIp?.trim()) return realIp.trim();
  }

  // Fallback conservador: no usar cabeceras manipulables por clientes
  // cuando no se haya declarado explicitamente un proxy confiable.
  return 'unknown';
}

export function rateLimit(input: {
  namespace: string;
  key: string;
  maxRequests: number;
  windowMs: number;
}): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const current = nowMs();
  cleanupIfNeeded(current);

  const bucketKey = `${input.namespace}:${input.key}`;
  const existing = buckets.get(bucketKey);

  if (!existing || existing.resetAt <= current) {
    buckets.set(bucketKey, { count: 1, resetAt: current + input.windowMs });
    return {
      allowed: true,
      remaining: Math.max(0, input.maxRequests - 1),
      retryAfterSeconds: Math.ceil(input.windowMs / 1000),
    };
  }

  if (existing.count >= input.maxRequests) {
    const retryMs = existing.resetAt - current;
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil(retryMs / 1000)),
    };
  }

  existing.count += 1;
  buckets.set(bucketKey, existing);
  return {
    allowed: true,
    remaining: Math.max(0, input.maxRequests - existing.count),
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - current) / 1000)),
  };
}
