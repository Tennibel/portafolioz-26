/**
 * db.ts - Conexion SQLite + esquema + helpers para el cotizador
 */
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', '..', 'data', 'cotizador.db');

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

export function updateQuoteStatus(id: number, status: string, notas_admin?: string): boolean {
  const db = getDb();
  const fields = ['status = @status', "updated_at = datetime('now')"];
  const params: Record<string, unknown> = { id, status };
  if (notas_admin !== undefined) {
    fields.push('notas_admin = @notas_admin');
    params.notas_admin = notas_admin;
  }
  const result = db.prepare(`UPDATE quotes SET ${fields.join(', ')} WHERE id = @id`).run(params);
  return result.changes > 0;
}

export function getQuoteStats(): { total: number; nueva: number; contactada: number; cerrada: number; descartada: number } {
  const db = getDb();
  const total = (db.prepare('SELECT COUNT(*) as c FROM quotes').get() as { c: number }).c;
  const nueva = (db.prepare("SELECT COUNT(*) as c FROM quotes WHERE status = 'nueva'").get() as { c: number }).c;
  const contactada = (db.prepare("SELECT COUNT(*) as c FROM quotes WHERE status = 'contactada'").get() as { c: number }).c;
  const cerrada = (db.prepare("SELECT COUNT(*) as c FROM quotes WHERE status = 'cerrada'").get() as { c: number }).c;
  const descartada = (db.prepare("SELECT COUNT(*) as c FROM quotes WHERE status = 'descartada'").get() as { c: number }).c;
  return { total, nueva, contactada, cerrada, descartada };
}
