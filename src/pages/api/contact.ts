/**
 * POST /api/contact - Recibir mensaje del formulario de contacto
 * Guarda en Active Campaign y responde OK
 */
export const prerender = false;

import type { APIRoute } from 'astro';
import { getClientIp, rateLimit } from '../../lib/rate-limit';
import { trackContactForm } from '../../lib/active-campaign';

export const POST: APIRoute = async ({ request }) => {
  const ip = getClientIp(request);
  const limit = rateLimit({
    namespace: 'public-contact',
    key: ip,
    maxRequests: 5,
    windowMs: 10 * 60 * 1000,
  });
  if (!limit.allowed) {
    return new Response(JSON.stringify({ ok: false, error: 'Demasiadas solicitudes. Intenta en unos minutos.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': String(limit.retryAfterSeconds) },
    });
  }

  try {
    const body = await request.json();
    const { nombre, email, telefono, proyecto } = body;

    if (!nombre || !email) {
      return new Response(JSON.stringify({ ok: false, error: 'Nombre y email son requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (typeof nombre !== 'string' || typeof email !== 'string' || nombre.length > 120 || email.length > 160) {
      return new Response(JSON.stringify({ ok: false, error: 'Datos invalidos' }), {
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

    // Registrar en Active Campaign
    await trackContactForm({ nombre, email, telefono, proyecto });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[api/contact] Error:', err);
    return new Response(JSON.stringify({ ok: false, error: 'Error del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
