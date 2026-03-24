/**
 * POST /api/lead-magnet - Registrar lead del popup de textos legales
 */
export const prerender = false;

import type { APIRoute } from 'astro';
import { getClientIp, rateLimit } from '../../lib/rate-limit';
import { trackLeadMagnet } from '../../lib/active-campaign';

export const POST: APIRoute = async ({ request }) => {
  const ip = getClientIp(request);
  const limit = rateLimit({
    namespace: 'public-lead-magnet',
    key: ip,
    maxRequests: 3,
    windowMs: 10 * 60 * 1000,
  });
  if (!limit.allowed) {
    return new Response(JSON.stringify({ ok: false, error: 'Demasiadas solicitudes.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { nombre, email } = await request.json();

    if (!nombre || !email || typeof nombre !== 'string' || typeof email !== 'string') {
      return new Response(JSON.stringify({ ok: false, error: 'Nombre y email son requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ ok: false, error: 'Email invalido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await trackLeadMagnet({ nombre, email });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[api/lead-magnet] Error:', err);
    return new Response(JSON.stringify({ ok: false, error: 'Error del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
