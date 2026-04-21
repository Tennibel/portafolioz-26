/**
 * POST /api/admin/micrositios-blog - Crea un nuevo post
 *
 * Recibe multipart/form-data con los campos del post + cover_image (File opcional).
 * Protegido por sesion admin.
 */
export const prerender = false;

import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../../lib/auth';
import { insertMicrositePost } from '../../../../lib/db';
import { isValidDomain } from '../../../../lib/micrositios';
import { saveProjectImage } from '../../../../lib/upload';

export const POST: APIRoute = async ({ request }) => {
  if (!isAuthenticated(request)) {
    return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const formData = await request.formData();
    const domain = String(formData.get('domain') || '').trim();
    const title = String(formData.get('title') || '').trim();
    const slug = String(formData.get('slug') || '').trim();
    const excerpt = String(formData.get('excerpt') || '').trim();
    const content = String(formData.get('content') || '').trim();
    const category = String(formData.get('category') || '').trim();
    const author = String(formData.get('author') || 'Portafolio Z').trim();
    const meta_title = String(formData.get('meta_title') || '').trim();
    const meta_description = String(formData.get('meta_description') || '').trim();
    const keywords = String(formData.get('keywords') || '').trim();
    const published = formData.get('published') === '1' ? 1 : 0;
    const featured = formData.get('featured') === '1' ? 1 : 0;
    const imageFile = formData.get('cover_image') as File | null;

    if (!domain || !title || !slug || !content) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Dominio, titulo, slug y contenido son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (!isValidDomain(domain)) {
      return new Response(JSON.stringify({ ok: false, error: 'Dominio no valido' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Slug invalido (solo minusculas, numeros y guiones)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (title.length > 200 || slug.length > 200 || content.length > 100_000) {
      return new Response(JSON.stringify({ ok: false, error: 'Campos exceden tamano permitido' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    let cover_image: string | undefined;
    if (imageFile && imageFile.size > 0) {
      const result = await saveProjectImage(imageFile);
      if (result.error) {
        return new Response(JSON.stringify({ ok: false, error: result.error }), {
          status: 400, headers: { 'Content-Type': 'application/json' },
        });
      }
      cover_image = result.path;
    }

    const id = insertMicrositePost({
      domain,
      title,
      slug,
      excerpt: excerpt || undefined,
      content,
      cover_image,
      category: category || undefined,
      author,
      meta_title: meta_title || undefined,
      meta_description: meta_description || undefined,
      keywords: keywords || undefined,
      published,
      featured,
    });

    return new Response(JSON.stringify({ ok: true, id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const msg =
      err instanceof Error && err.message.includes('UNIQUE')
        ? 'Ya existe un post con ese slug en ese dominio'
        : 'Error del servidor';
    console.error('[api/admin/micrositios-blog POST]', err);
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }
};
