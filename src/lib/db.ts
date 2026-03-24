/**
 * db.ts - Conexion SQLite + esquema + helpers para cotizador y proyectos
 */
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || join(__dirname, '..', '..', 'data', 'cotizador.db');

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');
    initSchema(_db);
  }
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT NOT NULL,
      telefono TEXT,
      empresa TEXT,
      tipo_sitio TEXT NOT NULL,
      num_paginas INTEGER DEFAULT 1,
      diseno TEXT NOT NULL,
      hosting TEXT,
      correo TEXT,
      total INTEGER NOT NULL,
      status TEXT DEFAULT 'nueva',
      notas_admin TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS quote_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quote_id INTEGER NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
      categoria TEXT NOT NULL,
      nombre TEXT NOT NULL,
      precio INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      url TEXT,
      categoria TEXT NOT NULL DEFAULT 'sitio-web',
      descripcion TEXT,
      imagen TEXT,
      featured INTEGER DEFAULT 0,
      visible INTEGER DEFAULT 1,
      orden INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

export type Quote = {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  empresa: string | null;
  tipo_sitio: string;
  num_paginas: number;
  diseno: string;
  hosting: string | null;
  correo: string | null;
  total: number;
  status: string;
  notas_admin: string | null;
  created_at: string;
  updated_at: string;
};

export type QuoteItem = {
  id: number;
  quote_id: number;
  categoria: string;
  nombre: string;
  precio: number;
};

export function insertQuote(data: {
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  tipo_sitio: string;
  num_paginas: number;
  diseno: string;
  hosting?: string;
  correo?: string;
  total: number;
  items: { categoria: string; nombre: string; precio: number }[];
}): number {
  const db = getDb();

  const insertMain = db.prepare(`
    INSERT INTO quotes (nombre, email, telefono, empresa, tipo_sitio, num_paginas, diseno, hosting, correo, total)
    VALUES (@nombre, @email, @telefono, @empresa, @tipo_sitio, @num_paginas, @diseno, @hosting, @correo, @total)
  `);

  const insertItem = db.prepare(`
    INSERT INTO quote_items (quote_id, categoria, nombre, precio)
    VALUES (@quote_id, @categoria, @nombre, @precio)
  `);

  const tx = db.transaction(() => {
    const result = insertMain.run({
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono || null,
      empresa: data.empresa || null,
      tipo_sitio: data.tipo_sitio,
      num_paginas: data.num_paginas,
      diseno: data.diseno,
      hosting: data.hosting || null,
      correo: data.correo || null,
      total: data.total,
    });

    const quoteId = result.lastInsertRowid as number;

    for (const item of data.items) {
      insertItem.run({ quote_id: quoteId, ...item });
    }

    return quoteId;
  });

  return tx();
}

export function getQuotes(status?: string, page = 1, perPage = 20): { quotes: Quote[]; total: number } {
  const db = getDb();
  const offset = (page - 1) * perPage;

  if (status && status !== 'todas') {
    const quotes = db.prepare('SELECT * FROM quotes WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?').all(status, perPage, offset) as Quote[];
    const total = (db.prepare('SELECT COUNT(*) as count FROM quotes WHERE status = ?').get(status) as { count: number }).count;
    return { quotes, total };
  }

  const quotes = db.prepare('SELECT * FROM quotes ORDER BY created_at DESC LIMIT ? OFFSET ?').all(perPage, offset) as Quote[];
  const total = (db.prepare('SELECT COUNT(*) as count FROM quotes').get() as { count: number }).count;
  return { quotes, total };
}

export function getQuoteById(id: number): { quote: Quote | undefined; items: QuoteItem[] } {
  const db = getDb();
  const quote = db.prepare('SELECT * FROM quotes WHERE id = ?').get(id) as Quote | undefined;
  const items = quote ? db.prepare('SELECT * FROM quote_items WHERE quote_id = ?').all(id) as QuoteItem[] : [];
  return { quote, items };
}

const ALLOWED_QUOTE_STATUSES = new Set(['nueva', 'contactada', 'cerrada', 'descartada']);

export function updateQuoteStatus(id: number, status?: string, notas_admin?: string): boolean {
  const db = getDb();
  const fields = ["updated_at = datetime('now')"];
  const params: Record<string, unknown> = { id };
  if (status !== undefined) {
    if (!ALLOWED_QUOTE_STATUSES.has(status)) return false;
    fields.push('status = @status');
    params.status = status;
  }
  if (notas_admin !== undefined) {
    fields.push('notas_admin = @notas_admin');
    params.notas_admin = notas_admin;
  }
  const result = db.prepare(`UPDATE quotes SET ${fields.join(', ')} WHERE id = @id`).run(params);
  return result.changes > 0;
}

export function getQuoteStats(): { total: number; nueva: number; contactada: number; cerrada: number; descartada: number } {
  const db = getDb();
  const row = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'nueva' THEN 1 ELSE 0 END) as nueva,
      SUM(CASE WHEN status = 'contactada' THEN 1 ELSE 0 END) as contactada,
      SUM(CASE WHEN status = 'cerrada' THEN 1 ELSE 0 END) as cerrada,
      SUM(CASE WHEN status = 'descartada' THEN 1 ELSE 0 END) as descartada
    FROM quotes
  `).get() as { total: number; nueva: number; contactada: number; cerrada: number; descartada: number };
  return { total: row.total, nueva: row.nueva ?? 0, contactada: row.contactada ?? 0, cerrada: row.cerrada ?? 0, descartada: row.descartada ?? 0 };
}

/* ============================================
   PROJECTS
   ============================================ */

export type Project = {
  id: number;
  nombre: string;
  slug: string;
  url: string | null;
  categoria: string;
  descripcion: string | null;
  imagen: string | null;
  featured: number;
  visible: number;
  orden: number;
  created_at: string;
  updated_at: string;
};

export function getProjects(opts?: { categoria?: string; page?: number; perPage?: number }): { projects: Project[]; total: number } {
  const db = getDb();
  const page = opts?.page || 1;
  const perPage = opts?.perPage || 20;
  const offset = (page - 1) * perPage;

  if (opts?.categoria && opts.categoria !== 'todas') {
    const projects = db.prepare('SELECT * FROM projects WHERE categoria = ? ORDER BY orden ASC, created_at DESC LIMIT ? OFFSET ?').all(opts.categoria, perPage, offset) as Project[];
    const total = (db.prepare('SELECT COUNT(*) as c FROM projects WHERE categoria = ?').get(opts.categoria) as { c: number }).c;
    return { projects, total };
  }

  const projects = db.prepare('SELECT * FROM projects ORDER BY orden ASC, created_at DESC LIMIT ? OFFSET ?').all(perPage, offset) as Project[];
  const total = (db.prepare('SELECT COUNT(*) as c FROM projects').get() as { c: number }).c;
  return { projects, total };
}

export function getVisibleProjects(opts?: { categoria?: string; page?: number; perPage?: number }): { projects: Project[]; total: number; hasMore: boolean } {
  const db = getDb();
  const page = opts?.page || 1;
  const perPage = opts?.perPage || 12;
  const offset = (page - 1) * perPage;

  let where = 'WHERE visible = 1';
  const params: unknown[] = [];
  if (opts?.categoria && opts.categoria !== 'todas') {
    where += ' AND categoria = ?';
    params.push(opts.categoria);
  }

  const total = (db.prepare(`SELECT COUNT(*) as c FROM projects ${where}`).get(...params) as { c: number }).c;
  const projects = db.prepare(`SELECT * FROM projects ${where} ORDER BY featured DESC, orden ASC, created_at DESC LIMIT ? OFFSET ?`).all(...params, perPage, offset) as Project[];
  return { projects, total, hasMore: offset + projects.length < total };
}

export function getProjectById(id: number): Project | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as Project | undefined;
}

export function insertProject(data: {
  nombre: string;
  slug: string;
  url?: string;
  categoria: string;
  descripcion?: string;
  imagen?: string;
  featured?: number;
  visible?: number;
  orden?: number;
}): number {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO projects (nombre, slug, url, categoria, descripcion, imagen, featured, visible, orden)
    VALUES (@nombre, @slug, @url, @categoria, @descripcion, @imagen, @featured, @visible, @orden)
  `).run({
    nombre: data.nombre,
    slug: data.slug,
    url: data.url || null,
    categoria: data.categoria,
    descripcion: data.descripcion || null,
    imagen: data.imagen || null,
    featured: data.featured || 0,
    visible: data.visible ?? 1,
    orden: data.orden || 0,
  });
  return result.lastInsertRowid as number;
}

const ALLOWED_PROJECT_COLUMNS = new Set<string>([
  'nombre', 'slug', 'url', 'categoria', 'descripcion', 'imagen', 'featured', 'visible', 'orden',
]);

export function updateProject(id: number, data: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>): boolean {
  const db = getDb();
  const fields: string[] = [];
  const params: Record<string, unknown> = { id };

  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined && ALLOWED_PROJECT_COLUMNS.has(key)) {
      fields.push(`${key} = @${key}`);
      params[key] = val;
    }
  }
  if (fields.length === 0) return false;
  fields.push("updated_at = datetime('now')");

  const result = db.prepare(`UPDATE projects SET ${fields.join(', ')} WHERE id = @id`).run(params);
  return result.changes > 0;
}

export function deleteProject(id: number): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM projects WHERE id = ?').run(id);
  return result.changes > 0;
}

export function getProjectStats(): { total: number; visibles: number; destacados: number } {
  const db = getDb();
  const total = (db.prepare('SELECT COUNT(*) as c FROM projects').get() as { c: number }).c;
  const visibles = (db.prepare('SELECT COUNT(*) as c FROM projects WHERE visible = 1').get() as { c: number }).c;
  const destacados = (db.prepare('SELECT COUNT(*) as c FROM projects WHERE featured = 1').get() as { c: number }).c;
  return { total, visibles, destacados };
}
