/**
 * auth.ts - Autenticacion simple por cookie para el admin
 */
import { createHmac } from 'crypto';

const COOKIE_NAME = 'pz_admin_session';
const MAX_AGE = 60 * 60 * 24; // 24 horas

function getSecret(): string {
  return import.meta.env.COOKIE_SECRET || 'portafolioz-dev-secret-change-me';
}

function getAdminPassword(): string {
  return import.meta.env.ADMIN_PASSWORD || 'admin123';
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
  const expected = sign(value);
  if (expected === signed) return value;
  return null;
}

export function checkPassword(password: string): boolean {
  return password === getAdminPassword();
}

export function createSessionCookie(): string {
  const token = `admin:${Date.now()}`;
  const signed = sign(token);
  return `${COOKIE_NAME}=${signed}; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=${MAX_AGE}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=0`;
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
