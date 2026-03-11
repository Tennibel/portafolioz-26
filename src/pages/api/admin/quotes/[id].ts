export const prerender = false;

import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../../lib/auth';
import { getQuoteById, updateQuoteStatus } from '../../../../lib/db';

export const GET: APIRoute = async ({ params, request }) => {
  if (!isAuthenticated(request)) {
    return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const id = parseInt(params.id || '0');
  const { quote, items } = getQuoteById(id);
  if (!quote) {
    return new Response(JSON.stringify({ ok: false, error: 'Cotizacion no encontrada' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true, quote, items }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const PATCH: APIRoute = async ({ params, request }) => {
  if (!isAuthenticated(request)) {
    return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const id = parseInt(params.id || '0');
    const body = await request.json();
    const { status, notas_admin } = body;

    if (status && !['nueva', 'contactada', 'cerrada', 'descartada'].includes(status)) {
      return new Response(JSON.stringify({ ok: false, error: 'Status invalido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updated = updateQuoteStatus(id, status, notas_admin);
    if (!updated) {
      return new Response(JSON.stringify({ ok: false, error: 'Cotizacion no encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Error del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
