/**
 * GET /api/micrositios/blog?domain=xxx&page=1&perPage=10[&category=yyy]
 *
 * API publica que cada micrositio consume para listar sus posts publicados.
 * CORS: permite solo dominios del ecosistema + localhost para dev.
 */
export const prerender = false;

import type { APIRoute } from 'astro';
import { getPublishedPostsByDomain } from '../../../../lib/db';
import { MICROSITIO_DOMAINS, isValidDomain } from '../../../../lib/micrositios';

function corsHeaders(origin: string | null): Record<string, string> {
  // Permitir cualquier subdominio + localhost en dev
  const allowed =
    (origin &&
      (MICROSITIO_DOMAINS.some((d) => origin === `https://${d}` || origin === `http://${d}` || origin === `https://www.${d}`) ||
       /^https?:\/\/localhost(:\d+)?$/.test(origin)))
      ? origin
      : 'https://portafolioz.com';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

export const OPTIONS: APIRoute = ({ request }) => {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) });
};

export const GET: APIRoute = ({ url, request }) => {
  const cors = corsHeaders(request.headers.get('origin'));
  const headers = { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' };

  const domain = url.searchParams.get('domain') || '';
  if (!domain || !isValidDomain(domain)) {
    return new Response(JSON.stringify({ ok: false, error: 'domain query param requerido y valido' }), {
      status: 400, headers,
    });
  }

  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const perPage = Math.min(50, Math.max(1, parseInt(url.searchParams.get('perPage') || '10', 10)));
  const category = url.searchParams.get('category') || undefined;

  const result = getPublishedPostsByDomain({ domain, page, perPage, category });

  // Sanitizar: devolver solo los campos publicos necesarios
  const posts = result.posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    cover_image: p.cover_image,
    category: p.category,
    author: p.author,
    featured: p.featured === 1,
    published_at: p.published_at,
    // content NO se envia en el listado (solo en el endpoint de slug)
  }));

  return new Response(
    JSON.stringify({
      ok: true,
      domain,
      page,
      perPage,
      total: result.total,
      hasMore: result.hasMore,
      posts,
    }),
    { status: 200, headers }
  );
};
