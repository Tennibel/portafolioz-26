export const prerender = false;

import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../lib/auth';
import { updatePricingItem, updatePaginaExtra } from '../../../lib/db';

export const POST: APIRoute = async ({ request }) => {
  if (!isAuthenticated(request)) {
    return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { updates } = await request.json();
    if (!Array.isArray(updates)) {
      return new Response(JSON.stringify({ ok: false, error: 'Formato invalido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let updated = 0;
    for (const u of updates) {
      if (!u.categoria || !u.item_id || !u.field || u.value === undefined) continue;

      if (u.categoria === 'general' && u.item_id === 'pagina_extra') {
        updatePaginaExtra(u.value);
        updated++;
        continue;
      }

      const data: Record<string, number | string> = {};
      data[u.field] = u.value;
      if (updatePricingItem(u.categoria, u.item_id, data)) updated++;
    }

    return new Response(JSON.stringify({ ok: true, updated }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Error del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
