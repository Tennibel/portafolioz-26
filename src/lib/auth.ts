/**
 * auth.ts - Autenticacion simple por cookie para el admin
 */
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto';

const COOKIE_NAME = 'pz_admin_session';
const MAX_AGE = 60 * 60 * 24; // 24 horas

function getSecret(): string {
  const secret = import.meta.env.COOKIE_SECRET;
  if (secret) return secret;
  if (import.meta.env.PROD) {
    throw new Error('COOKIE_SECRET no esta configurado en produccion.');
  }
  return 'dev-only-cookie-secret-change-me';
}

function getAdminPassword(): string {
  const password = import.meta.env.ADMIN_PASSWORD;
  if (password) return password;
  if (import.meta.env.PROD) {
    throw new Error('ADMIN_PASSWORD no esta configurado en produccion.');
  }
  return 'admin123-dev-only';
}

function sign(value: string): string {
  const secret = getSecret();
  const sig = createHmac('sha256', secret).update(value).digest('hex');
  return `${value}.${sig}`;
}

function verify(signed: string): string | null {
  const idx = signed.lastIndexOf('.');
  if (idx === -1) return null;
  const value = signed.slice(0, idx);
  const receivedSig = signed.slice(idx + 1);
  const expectedSig = createHmac('sha256', getSecret()).update(value).digest('hex');
  const receivedBuf = Buffer.from(receivedSig, 'utf8');
  const expectedBuf = Buffer.from(expectedSig, 'utf8');
  if (receivedBuf.length !== expectedBuf.length) return null;
  if (timingSafeEqual(receivedBuf, expectedBuf)) return value;
  return null;
}

export function checkPassword(password: string): boolean {
  if (!password) return false;
  const providedHash = createHash('sha256').update(password).digest();
  const expectedHash = createHash('sha256').update(getAdminPassword()).digest();
  return timingSafeEqual(providedHash, expectedHash);
}

export function createSessionCookie(): string {
  const token = `admin:${Date.now()}:${randomBytes(16).toString('hex')}`;
  const signed = sign(token);
  const secure = import.meta.env.PROD ? '; Secure' : '';
  return `${COOKIE_NAME}=${signed}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${MAX_AGE}${secure}`;
}

export function clearSessionCookie(): string {
  const secure = import.meta.env.PROD ? '; Secure' : '';
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}

export function isAuthenticated(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );
  const sessionCookie = cookies[COOKIE_NAME];
  if (!sessionCookie) return false;
  const value = verify(sessionCookie);
  if (!value) return false;
  // Check expiry
  const ts = parseInt(value.split(':')[1]);
  if (Date.now() - ts > MAX_AGE * 1000) return false;
  return true;
}
