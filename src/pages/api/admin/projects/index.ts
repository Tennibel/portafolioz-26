export const prerender = false;

import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../../lib/auth';
import { insertProject } from '../../../../lib/db';
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
    const nombre = formData.get('nombre') as string;
    const slug = formData.get('slug') as string;
    const url = formData.get('url') as string;
    const categoria = formData.get('categoria') as string;
    const descripcion = formData.get('descripcion') as string;
    const featured = formData.get('featured') === '1' ? 1 : 0;
    const visible = formData.get('visible') === '1' ? 1 : 0;
    const orden = parseInt(formData.get('orden') as string) || 0;
    const imageFile = formData.get('imagen') as File | null;

    if (!nombre || !slug || !categoria) {
      return new Response(JSON.stringify({ ok: false, error: 'Nombre, slug y categoria son requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let imagen: string | undefined;
    if (imageFile && imageFile.size > 0) {
      const result = await saveProjectImage(imageFile);
      if (result.error) {
        return new Response(JSON.stringify({ ok: false, error: result.error }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      imagen = result.path;
    }

    const id = insertProject({ nombre, slug, url, categoria, descripcion, imagen, featured, visible, orden });

    return new Response(JSON.stringify({ ok: true, id }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error && err.message.includes('UNIQUE') ? 'El slug ya existe' : 'Error del servidor';
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
