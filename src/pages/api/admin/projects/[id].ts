export const prerender = false;

import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../../lib/auth';
import { getProjectById, updateProject, deleteProject } from '../../../../lib/db';
import { saveProjectImage, deleteProjectImage } from '../../../../lib/upload';

export const PATCH: APIRoute = async ({ params, request }) => {
  if (!isAuthenticated(request)) {
    return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const id = parseInt(params.id || '0');
    const project = getProjectById(id);
    if (!project) {
      return new Response(JSON.stringify({ ok: false, error: 'Proyecto no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const formData = await request.formData();
    const data: Record<string, unknown> = {};

    for (const key of ['nombre', 'slug', 'url', 'categoria', 'descripcion']) {
      const val = formData.get(key);
      if (val !== null) data[key] = val as string;
    }
    const featuredVal = formData.get('featured');
    if (featuredVal !== null) data.featured = featuredVal === '1' ? 1 : 0;
    const visibleVal = formData.get('visible');
    if (visibleVal !== null) data.visible = visibleVal === '1' ? 1 : 0;
    const ordenVal = formData.get('orden');
    if (ordenVal !== null) data.orden = parseInt(ordenVal as string) || 0;

    const imageFile = formData.get('imagen') as File | null;
    if (imageFile && imageFile.size > 0) {
      const result = await saveProjectImage(imageFile);
      if (result.error) {
        return new Response(JSON.stringify({ ok: false, error: result.error }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (project.imagen) deleteProjectImage(project.imagen);
      data.imagen = result.path;
    }

    updateProject(id, data);

    return new Response(JSON.stringify({ ok: true }), {
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

export const DELETE: APIRoute = async ({ params, request }) => {
  if (!isAuthenticated(request)) {
    return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const id = parseInt(params.id || '0');
  const project = getProjectById(id);
  if (!project) {
    return new Response(JSON.stringify({ ok: false, error: 'Proyecto no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (project.imagen) deleteProjectImage(project.imagen);
  deleteProject(id);

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
