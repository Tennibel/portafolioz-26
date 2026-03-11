export const prerender = false;

import type { APIRoute } from 'astro';
import { getVisibleProjects } from '../../lib/db';

export const GET: APIRoute = async ({ url }) => {
  const page = parseInt(url.searchParams.get('page') || '1');
  const categoria = url.searchParams.get('categoria') || undefined;

  const { projects, hasMore } = getVisibleProjects({ categoria, page, perPage: 12 });

  return new Response(JSON.stringify({ projects, hasMore }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
