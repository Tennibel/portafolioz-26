/**
 * Serve uploaded project images from UPLOAD_DIR in production.
 * In development, Astro serves them from public/uploads/projects/.
 * In Docker, files are in the mounted volume at UPLOAD_DIR.
 */
export const prerender = false;

import type { APIRoute } from 'astro';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR;

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

export const GET: APIRoute = async ({ params }) => {
  // Only needed when UPLOAD_DIR is set (Docker production)
  if (!UPLOAD_DIR) {
    return new Response('Not found', { status: 404 });
  }

  const fileName = params.file;
  if (!fileName || fileName.includes('..')) {
    return new Response('Not found', { status: 404 });
  }

  const filePath = join(UPLOAD_DIR, fileName);
  if (!existsSync(filePath)) {
    return new Response('Not found', { status: 404 });
  }

  const ext = extname(fileName).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  const data = readFileSync(filePath);
  return new Response(data, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
