/**
 * POST /api/quote - Recibir cotizacion, guardar en DB, enviar emails
 */
export const prerender = false;

import type { APIRoute } from 'astro';
import { calculateTotal, PRICING } from '../../../lib/pricing';
import { insertQuote } from '../../../lib/db';
import { sendQuoteEmails } from '../../../lib/email';
import { getClientIp, rateLimit } from '../../../lib/rate-limit';
import { trackQuote } from '../../../lib/active-campaign';

const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 160;
const MAX_PHONE_LENGTH = 30;
const MAX_COMPANY_LENGTH = 120;
const MAX_PAGES = 200;
const MAX_ITEMS_PER_GROUP = 20;

export const POST: APIRoute = async ({ request }) => {
  const ip = getClientIp(request);
  const quoteLimit = rateLimit({
    namespace: 'public-quote',
    key: ip,
    maxRequests: 10,
    windowMs: 10 * 60 * 1000,
  });
  if (!quoteLimit.allowed) {
    return new Response(JSON.stringify({ ok: false, error: 'Demasiadas solicitudes. Intenta de nuevo en unos minutos.' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(quoteLimit.retryAfterSeconds),
      },
    });
  }

  try {
    const body = await request.json();

    // Validar campos requeridos
    const { nombre, email, tipo_sitio, num_paginas, diseno, hosting, correo, funcionalidades, extras, urgencia, mantenimiento, idiomas } = body;

    if (!nombre || !email || !tipo_sitio || !diseno) {
      return new Response(JSON.stringify({ ok: false, error: 'Faltan campos requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (
      typeof nombre !== 'string' ||
      typeof email !== 'string' ||
      (body.telefono && typeof body.telefono !== 'string') ||
      (body.empresa && typeof body.empresa !== 'string')
    ) {
      return new Response(JSON.stringify({ ok: false, error: 'Formato de datos invalido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (
      nombre.length > MAX_NAME_LENGTH ||
      email.length > MAX_EMAIL_LENGTH ||
      (body.telefono && body.telefono.length > MAX_PHONE_LENGTH) ||
      (body.empresa && body.empresa.length > MAX_COMPANY_LENGTH)
    ) {
      return new Response(JSON.stringify({ ok: false, error: 'Algunos campos exceden el tamano permitido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validar email basico
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ ok: false, error: 'Email invalido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validar que tipo_sitio existe
    if (!PRICING.tipoSitio.find(t => t.id === tipo_sitio)) {
      return new Response(JSON.stringify({ ok: false, error: 'Tipo de sitio invalido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const safeNumPaginas = Number.parseInt(String(num_paginas), 10);
    if (!Number.isFinite(safeNumPaginas) || safeNumPaginas < 1 || safeNumPaginas > MAX_PAGES) {
      return new Response(JSON.stringify({ ok: false, error: 'Numero de paginas invalido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const safeFuncionalidades = Array.isArray(funcionalidades) ? funcionalidades.slice(0, MAX_ITEMS_PER_GROUP) : [];
    const safeExtras = Array.isArray(extras) ? extras.slice(0, MAX_ITEMS_PER_GROUP) : [];

    // Calcular total del lado del servidor (no confiar en el frontend)
    const { total, items } = calculateTotal({
      tipo_sitio,
      num_paginas: safeNumPaginas,
      diseno,
      hosting: hosting || 'propio',
      correo: correo || 'sin',
      funcionalidades: safeFuncionalidades,
      extras: safeExtras,
      urgencia: urgencia || 'normal',
      mantenimiento: mantenimiento || 'sin',
      idiomas: idiomas || 'uno',
    });

    // Guardar en SQLite
    const quoteId = insertQuote({
      nombre,
      email,
      telefono: body.telefono || undefined,
      empresa: body.empresa || undefined,
      tipo_sitio,
      num_paginas: safeNumPaginas,
      diseno,
      hosting: hosting || 'propio',
      correo: correo || 'sin',
      total,
      items,
    });

    // Enviar emails (no bloquea la respuesta si falla)
    sendQuoteEmails({ nombre, email, telefono: body.telefono, empresa: body.empresa, total, items }).catch(err => {
      console.error('[api/quote] Error enviando emails:', err);
    });

    // Registrar en Active Campaign (no bloquea la respuesta)
    trackQuote({ nombre, email, telefono: body.telefono, empresa: body.empresa, total, items }).catch(err => {
      console.error('[api/quote] Error en Active Campaign:', err);
    });

    return new Response(JSON.stringify({ ok: true, quoteId, total }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error del servidor';
    console.error('[api/quote] Error:', message);
    return new Response(JSON.stringify({ ok: false, error: 'Error del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
