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
    seedPricingIfEmpty();
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

    CREATE TABLE IF NOT EXISTS pricing_config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoria TEXT NOT NULL,
      item_id TEXT NOT NULL,
      label TEXT NOT NULL,
      descripcion TEXT,
      precio INTEGER DEFAULT 0,
      base INTEGER DEFAULT 0,
      multiplicador REAL DEFAULT 1,
      included INTEGER DEFAULT 0,
      orden INTEGER DEFAULT 0,
      UNIQUE(categoria, item_id)
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

/* ============================================
   PRICING CONFIG
   ============================================ */

export type PricingItem = {
  id: number;
  categoria: string;
  item_id: string;
  label: string;
  descripcion: string | null;
  precio: number;
  base: number;
  multiplicador: number;
  included: number;
  orden: number;
};

export function getPricingByCategory(categoria: string): PricingItem[] {
  const db = getDb();
  return db.prepare('SELECT * FROM pricing_config WHERE categoria = ? ORDER BY orden ASC').all(categoria) as PricingItem[];
}

export function getAllPricing(): Record<string, PricingItem[]> {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM pricing_config ORDER BY categoria, orden ASC').all() as PricingItem[];
  const grouped: Record<string, PricingItem[]> = {};
  for (const row of rows) {
    if (!grouped[row.categoria]) grouped[row.categoria] = [];
    grouped[row.categoria].push(row);
  }
  return grouped;
}

export function updatePricingItem(categoria: string, item_id: string, data: { precio?: number; base?: number; multiplicador?: number; label?: string; descripcion?: string }): boolean {
  const db = getDb();
  const fields: string[] = [];
  const params: Record<string, unknown> = { categoria, item_id };

  if (data.precio !== undefined) { fields.push('precio = @precio'); params.precio = data.precio; }
  if (data.base !== undefined) { fields.push('base = @base'); params.base = data.base; }
  if (data.multiplicador !== undefined) { fields.push('multiplicador = @multiplicador'); params.multiplicador = data.multiplicador; }
  if (data.label !== undefined) { fields.push('label = @label'); params.label = data.label; }
  if (data.descripcion !== undefined) { fields.push('descripcion = @descripcion'); params.descripcion = data.descripcion; }

  if (fields.length === 0) return false;
  const result = db.prepare(`UPDATE pricing_config SET ${fields.join(', ')} WHERE categoria = @categoria AND item_id = @item_id`).run(params);
  return result.changes > 0;
}

export function updatePaginaExtra(precio: number): boolean {
  const db = getDb();
  const result = db.prepare('UPDATE pricing_config SET precio = @precio WHERE categoria = @categoria AND item_id = @item_id').run({ categoria: 'general', item_id: 'pagina_extra', precio });
  return result.changes > 0;
}

export function getPaginaExtra(): number {
  const db = getDb();
  const row = db.prepare("SELECT precio FROM pricing_config WHERE categoria = 'general' AND item_id = 'pagina_extra'").get() as { precio: number } | undefined;
  return row?.precio ?? 900;
}

export function seedPricingIfEmpty(): void {
  const db = getDb();
  const count = (db.prepare('SELECT COUNT(*) as c FROM pricing_config').get() as { c: number }).c;
  if (count > 0) return;

  const insert = db.prepare('INSERT INTO pricing_config (categoria, item_id, label, descripcion, precio, base, multiplicador, included, orden) VALUES (@categoria, @item_id, @label, @descripcion, @precio, @base, @multiplicador, @included, @orden)');

  const tx = db.transaction(() => {
    // General
    insert.run({ categoria: 'general', item_id: 'pagina_extra', label: 'Pagina extra', descripcion: null, precio: 900, base: 0, multiplicador: 1, included: 0, orden: 0 });

    // Hosting
    const hosting = [
      { item_id: 'propio', label: 'Ya tengo hosting', descripcion: 'Usaremos tu servidor actual', precio: 0, orden: 0 },
      { item_id: '5gb', label: 'Dominio + 5 GB', descripcion: 'Ideal para landing pages', precio: 650, orden: 1 },
      { item_id: '10gb', label: 'Dominio + 10 GB', descripcion: 'Sitios corporativos', precio: 890, orden: 2 },
      { item_id: '15gb', label: 'Dominio + 15 GB', descripcion: 'Tiendas y sitios grandes', precio: 1290, orden: 3 },
    ];
    for (const h of hosting) insert.run({ ...h, categoria: 'hosting', base: 0, multiplicador: 1, included: 0 });

    // Correo
    const correo = [
      { item_id: 'sin', label: 'Sin correos', precio: 0, orden: 0 },
      { item_id: '2cuentas', label: '2 cuentas', precio: 220, orden: 1 },
      { item_id: '6cuentas', label: '6 cuentas', precio: 320, orden: 2 },
      { item_id: 'ilimitado', label: 'Ilimitado', precio: 900, orden: 3 },
    ];
    for (const c of correo) insert.run({ ...c, categoria: 'correo', descripcion: null, base: 0, multiplicador: 1, included: 0 });

    // Tipo de sitio
    const tipoSitio = [
      { item_id: 'landing', label: 'Landing Page', descripcion: '1 pagina (1 seccion)', base: 3800, orden: 0 },
      { item_id: 'basico', label: 'Web Corporativa', descripcion: '2 a 4 paginas', base: 6400, orden: 1 },
      { item_id: 'profesional', label: 'Web SEO Performance', descripcion: '5 a 8 paginas', base: 8900, orden: 2 },
      { item_id: 'empresarial', label: 'Headless Premium', descripcion: '9 a 12 paginas', base: 10600, orden: 3 },
    ];
    for (const t of tipoSitio) insert.run({ ...t, categoria: 'tipoSitio', precio: 0, multiplicador: 1, included: 0 });

    // Diseno
    const diseno = [
      { item_id: 'cliente', label: 'Cliente provee diseno', descripcion: 'Tu nos envias los archivos de diseno', precio: 0, orden: 0 },
      { item_id: 'desde_cero', label: 'Diseno desde cero', descripcion: 'Creamos un diseno original y unico', precio: 3200, orden: 1 },
    ];
    for (const d of diseno) insert.run({ ...d, categoria: 'diseno', base: 0, multiplicador: 1, included: 0 });

    // Funcionalidades
    const funcionalidades = [
      { item_id: 'contacto', label: 'Formulario de contacto', precio: 0, included: 1, orden: 0 },
      { item_id: 'blog', label: 'Blog integrado', precio: 1200, included: 0, orden: 1 },
      { item_id: 'catalogo', label: 'Catalogo de productos', precio: 3800, included: 0, orden: 2 },
      { item_id: 'entregas', label: 'Sistema de entregas', precio: 4500, included: 0, orden: 3 },
      { item_id: 'tienda', label: 'Tienda online', precio: 7800, included: 0, orden: 4 },
      { item_id: 'citas', label: 'Sistema de citas', precio: 3800, included: 0, orden: 5 },
      { item_id: 'cotizador', label: 'Cotizador', precio: 1800, included: 0, orden: 6 },
      { item_id: 'crm', label: 'CRM', precio: 2400, included: 0, orden: 7 },
    ];
    for (const f of funcionalidades) insert.run({ ...f, categoria: 'funcionalidades', descripcion: null, base: 0, multiplicador: 1 });

    // Extras
    const extras = [
      { item_id: 'whatsapp', label: 'Boton WhatsApp', precio: 500, included: 0, orden: 0 },
      { item_id: 'chatbot', label: 'Chatbot', precio: 4800, included: 0, orden: 1 },
      { item_id: 'localizador', label: 'Localizador de tiendas', precio: 1200, included: 0, orden: 2 },
      { item_id: 'lector_pdf', label: 'Lector PDF', precio: 500, included: 0, orden: 3 },
      { item_id: 'seo_avanzado', label: 'SEO avanzado', precio: 1800, included: 0, orden: 4 },
      { item_id: 'analytics', label: 'Google Analytics', precio: 0, included: 1, orden: 5 },
      { item_id: 'ssl', label: 'Certificado SSL', precio: 0, included: 1, orden: 6 },
    ];
    for (const e of extras) insert.run({ ...e, categoria: 'extras', descripcion: null, base: 0, multiplicador: 1 });

    // Urgencia
    const urgencia = [
      { item_id: 'normal', label: 'Normal', descripcion: 'Tiempo estandar, sin costo extra', multiplicador: 1, orden: 0 },
      { item_id: 'express', label: 'Express', descripcion: 'Entrega 30% mas rapido', multiplicador: 1.3, orden: 1 },
      { item_id: 'urgente', label: 'Urgente', descripcion: 'Entrega 50% mas rapido', multiplicador: 1.5, orden: 2 },
    ];
    for (const u of urgencia) insert.run({ ...u, categoria: 'urgencia', precio: 0, base: 0, included: 0 });

    // Mantenimiento
    const mantenimiento = [
      { item_id: 'sin', label: 'Sin mantenimiento', descripcion: 'Solo la entrega del sitio', precio: 0, orden: 0 },
      { item_id: 'basico', label: 'Basico', descripcion: 'Actualizaciones, backups y soporte basico', precio: 1200, orden: 1 },
      { item_id: 'avanzado', label: 'Avanzado', descripcion: 'Todo lo basico + SEO mensual, contenido y reportes', precio: 2800, orden: 2 },
    ];
    for (const m of mantenimiento) insert.run({ ...m, categoria: 'mantenimiento', base: 0, multiplicador: 1, included: 0 });

    // Idiomas
    const idiomas = [
      { item_id: 'uno', label: 'Un idioma', descripcion: 'Espanol', precio: 0, orden: 0 },
      { item_id: 'bilingue', label: 'Bilingue', descripcion: 'Espanol + Ingles', precio: 2400, orden: 1 },
      { item_id: 'trilingue', label: 'Trilingue', descripcion: 'Espanol + Ingles + otro', precio: 4200, orden: 2 },
    ];
    for (const i of idiomas) insert.run({ ...i, categoria: 'idiomas', base: 0, multiplicador: 1, included: 0 });
  });

  tx();
}
