export const prerender = false;

import type { APIRoute } from 'astro';
import { checkPassword, createSessionCookie } from '../../../lib/auth';
import { getClientIp, rateLimit } from '../../../lib/rate-limit';

export const POST: APIRoute = async ({ request }) => {
  const ip = getClientIp(request);
  const authLimit = rateLimit({
    namespace: 'admin-login',
    key: ip,
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (!authLimit.allowed) {
    return new Response(JSON.stringify({ ok: false, error: 'Demasiados intentos. Intenta mas tarde.' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(authLimit.retryAfterSeconds),
      },
    });
  }

  try {
    const body = await request.json();
    const { password } = body;

    if (!password || !checkPassword(password)) {
      return new Response(JSON.stringify({ ok: false, error: 'Contrasena incorrecta' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': createSessionCookie(),
      },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Error del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
