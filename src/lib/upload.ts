/**
 * upload.ts - Helper para subir imagenes de proyectos
 */
import { writeFileSync, mkdirSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = process.env.UPLOAD_DIR || join(__dirname, '..', '..', 'public', 'uploads', 'projects');

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

mkdirSync(UPLOAD_DIR, { recursive: true });

export async function saveProjectImage(file: File): Promise<{ path: string; error?: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { path: '', error: 'Tipo de archivo no permitido. Solo JPG, PNG y WebP.' };
  }
  if (file.size > MAX_SIZE) {
    return { path: '', error: 'El archivo excede el limite de 5MB.' };
  }

  const ext = file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : 'webp';
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filePath = join(UPLOAD_DIR, uniqueName);

  const buffer = Buffer.from(await file.arrayBuffer());
  writeFileSync(filePath, buffer);

  return { path: `/uploads/projects/${uniqueName}` };
}

export function deleteProjectImage(imagePath: string): void {
  if (!imagePath) return;
  // In Docker, uploads are in UPLOAD_DIR; locally in public/
  const fullPath = process.env.UPLOAD_DIR
    ? join(process.env.UPLOAD_DIR, imagePath.replace('/uploads/projects/', ''))
    : join(__dirname, '..', '..', 'public', imagePath);
  if (existsSync(fullPath)) {
    try { unlinkSync(fullPath); } catch { /* ignore */ }
  }
}
