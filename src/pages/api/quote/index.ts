/**
 * POST /api/quote - Recibir cotizacion, guardar en DB, enviar emails
 */
export const prerender = false;

import type { APIRoute } from 'astro';
import { calculateTotal, PRICING } from '../../../lib/pricing';
import { insertQuote } from '../../../lib/db';
import { sendQuoteEmails } from '../../../lib/email';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Validar campos requeridos
    const { nombre, email, tipo_sitio, num_paginas, diseno, hosting, correo, funcionalidades, extras } = body;

    if (!nombre || !email || !tipo_sitio || !diseno) {
      return new Response(JSON.stringify({ ok: false, error: 'Faltan campos requeridos' }), {
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

    // Calcular total del lado del servidor (no confiar en el frontend)
    const { total, items } = calculateTotal({
      tipo_sitio,
      num_paginas: parseInt(num_paginas) || 1,
      diseno,
      hosting: hosting || 'propio',
      correo: correo || 'sin',
      funcionalidades: Array.isArray(funcionalidades) ? funcionalidades : [],
      extras: Array.isArray(extras) ? extras : [],
    });

    // Guardar en SQLite
    const quoteId = insertQuote({
      nombre,
      email,
      telefono: body.telefono || undefined,
      empresa: body.empresa || undefined,
      tipo_sitio,
      num_paginas: parseInt(num_paginas) || 1,
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
