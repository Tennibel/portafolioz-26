/**
 * PUT /api/admin/micrositios-blog/[id] - Actualiza un post
 * DELETE /api/admin/micrositios-blog/[id] - Elimina un post
 *
 * Protegido por sesion admin.
 */
export const prerender = false;

import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../../lib/auth';
import {
  updateMicrositePost,
  deleteMicrositePost,
  getMicrositePostById,
} from '../../../../lib/db';
import { isValidDomain } from '../../../../lib/micrositios';
import { saveProjectImage } from '../../../../lib/upload';

export const PUT: APIRoute = async ({ request, params }) => {
  if (!isAuthenticated(request)) {
    return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }

  const id = parseInt(params.id || '', 10);
  if (!Number.isFinite(id) || id <= 0) {
    return new Response(JSON.stringify({ ok: false, error: 'ID invalido' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const existing = getMicrositePostById(id);
  if (!existing) {
    return new Response(JSON.stringify({ ok: false, error: 'Post no encontrado' }), {
      status: 404, headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const formData = await request.formData();
    const update: Record<string, unknown> = {};

    const get = (key: string) => {
      const v = formData.get(key);
      return v === null ? undefined : String(v).trim();
    };

    const domain = get('domain');
    if (domain !== undefined) {
      if (!isValidDomain(domain)) {
        return new Response(JSON.stringify({ ok: false, error: 'Dominio no valido' }), {
          status: 400, headers: { 'Content-Type': 'application/json' },
        });
      }
      update.domain = domain;
    }

    const slug = get('slug');
    if (slug !== undefined) {
      if (!/^[a-z0-9-]+$/.test(slug)) {
        return new Response(
          JSON.stringify({ ok: false, error: 'Slug invalido' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      update.slug = slug;
    }

    for (const key of ['title', 'excerpt', 'content', 'category', 'author', 'meta_title', 'meta_description', 'keywords']) {
      const v = get(key);
      if (v !== undefined) update[key] = v;
    }

    if (formData.get('published') !== null) update.published = formData.get('published') === '1' ? 1 : 0;
    if (formData.get('featured') !== null) update.featured = formData.get('featured') === '1' ? 1 : 0;

    const imageFile = formData.get('cover_image') as File | null;
    if (imageFile && imageFile.size > 0) {
      const result = await saveProjectImage(imageFile);
      if (result.error) {
        return new Response(JSON.stringify({ ok: false, error: result.error }), {
          status: 400, headers: { 'Content-Type': 'application/json' },
        });
      }
      update.cover_image = result.path;
    }

    const ok = updateMicrositePost(id, update);
    return new Response(JSON.stringify({ ok }), {
      status: ok ? 200 : 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const msg =
      err instanceof Error && err.message.includes('UNIQUE')
        ? 'Ya existe un post con ese slug en ese dominio'
        : 'Error del servidor';
    console.error('[api/admin/micrositios-blog PUT]', err);
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ request, params }) => {
  if (!isAuthenticated(request)) {
    return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }

  const id = parseInt(params.id || '', 10);
  if (!Number.isFinite(id) || id <= 0) {
    return new Response(JSON.stringify({ ok: false, error: 'ID invalido' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const ok = deleteMicrositePost(id);
  return new Response(JSON.stringify({ ok }), {
    status: ok ? 200 : 404,
    headers: { 'Content-Type': 'application/json' },
  });
};
