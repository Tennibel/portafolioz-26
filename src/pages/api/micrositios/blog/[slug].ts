/**
 * GET /api/micrositios/blog/[slug]?domain=xxx
 *
 * Devuelve el post completo (con content markdown) para renderizar en el micrositio.
 * Incrementa contador de views.
 */
export const prerender = false;

import type { APIRoute } from 'astro';
import { getPublishedPostBySlug, incrementPostViews } from '../../../../lib/db';
import { MICROSITIO_DOMAINS, isValidDomain } from '../../../../lib/micrositios';

function corsHeaders(origin: string | null): Record<string, string> {
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

export const GET: APIRoute = ({ url, params, request }) => {
  const cors = corsHeaders(request.headers.get('origin'));
  const headers = { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' };

  const slug = params.slug || '';
  const domain = url.searchParams.get('domain') || '';

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return new Response(JSON.stringify({ ok: false, error: 'Slug invalido' }), { status: 400, headers });
  }
  if (!domain || !isValidDomain(domain)) {
    return new Response(JSON.stringify({ ok: false, error: 'domain query param requerido y valido' }), {
      status: 400, headers,
    });
  }

  const post = getPublishedPostBySlug(domain, slug);
  if (!post) {
    return new Response(JSON.stringify({ ok: false, error: 'Post no encontrado' }), { status: 404, headers });
  }

  // No bloqueamos la respuesta
  try { incrementPostViews(post.id); } catch {}

  return new Response(
    JSON.stringify({
      ok: true,
      post: {
        id: post.id,
        domain: post.domain,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        cover_image: post.cover_image,
        category: post.category,
        author: post.author,
        meta_title: post.meta_title,
        meta_description: post.meta_description,
        keywords: post.keywords,
        featured: post.featured === 1,
        published_at: post.published_at,
      },
    }),
    { status: 200, headers }
  );
};
