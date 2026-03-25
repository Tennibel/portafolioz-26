/**
 * pricing.ts - Fuente unica de verdad para precios del cotizador
 * Lee precios de la BD (pricing_config). Fallback a valores por defecto si la BD no esta disponible.
 */
import { getAllPricing, getPaginaExtra, type PricingItem } from './db';

// Valores por defecto (fallback si la BD no esta disponible)
const DEFAULT_PRICING = {
  hosting: [
    { id: 'propio', label: 'Ya tengo hosting', desc: 'Usaremos tu servidor actual', precio: 0 },
    { id: '5gb', label: 'Dominio + 5 GB', desc: 'Ideal para landing pages', precio: 650 },
    { id: '10gb', label: 'Dominio + 10 GB', desc: 'Sitios corporativos', precio: 890 },
    { id: '15gb', label: 'Dominio + 15 GB', desc: 'Tiendas y sitios grandes', precio: 1290 },
  ],
  correo: [
    { id: 'sin', label: 'Sin correos', precio: 0 },
    { id: '2cuentas', label: '2 cuentas', precio: 220 },
    { id: '6cuentas', label: '6 cuentas', precio: 320 },
    { id: 'ilimitado', label: 'Ilimitado', precio: 900 },
  ],
  tipoSitio: [
    { id: 'landing', label: 'Landing Page', desc: '1 pagina (1 seccion)', base: 3800 },
    { id: 'basico', label: 'Web Corporativa', desc: '2 a 4 paginas', base: 6400 },
    { id: 'profesional', label: 'Web SEO Performance', desc: '5 a 8 paginas', base: 8900 },
    { id: 'empresarial', label: 'Headless Premium', desc: '9 a 12 paginas', base: 10600 },
  ],
  paginaExtra: 900,
  diseno: [
    { id: 'cliente', label: 'Cliente provee diseno', desc: 'Tu nos envias los archivos de diseno', precio: 0 },
    { id: 'desde_cero', label: 'Diseno desde cero', desc: 'Creamos un diseno original y unico', precio: 3200 },
  ],
  funcionalidades: [
    { id: 'contacto', label: 'Formulario de contacto', precio: 0, included: true },
    { id: 'blog', label: 'Blog integrado', precio: 1200 },
    { id: 'catalogo', label: 'Catalogo de productos', precio: 3800 },
    { id: 'entregas', label: 'Sistema de entregas', precio: 4500 },
    { id: 'tienda', label: 'Tienda online', precio: 7800 },
    { id: 'citas', label: 'Sistema de citas', precio: 3800 },
    { id: 'cotizador', label: 'Cotizador', precio: 1800 },
    { id: 'crm', label: 'CRM', precio: 2400 },
  ],
  extras: [
    { id: 'whatsapp', label: 'Boton WhatsApp', precio: 500 },
    { id: 'chatbot', label: 'Chatbot', precio: 4800 },
    { id: 'localizador', label: 'Localizador de tiendas', precio: 1200 },
    { id: 'lector_pdf', label: 'Lector PDF', precio: 500 },
    { id: 'seo_avanzado', label: 'SEO avanzado', precio: 1800 },
    { id: 'analytics', label: 'Google Analytics', precio: 0, included: true },
    { id: 'ssl', label: 'Certificado SSL', precio: 0, included: true },
  ],
  urgencia: [
    { id: 'normal', label: 'Normal', desc: 'Tiempo estandar, sin costo extra', multiplicador: 1 },
    { id: 'express', label: 'Express', desc: 'Entrega 30% mas rapido', multiplicador: 1.3 },
    { id: 'urgente', label: 'Urgente', desc: 'Entrega 50% mas rapido', multiplicador: 1.5 },
  ],
  mantenimiento: [
    { id: 'sin', label: 'Sin mantenimiento', desc: 'Solo la entrega del sitio', precio: 0 },
    { id: 'basico', label: 'Basico', desc: 'Actualizaciones, backups y soporte basico', precio: 1200 },
    { id: 'avanzado', label: 'Avanzado', desc: 'Todo lo basico + SEO mensual, contenido y reportes', precio: 2800 },
  ],
  idiomas: [
    { id: 'uno', label: 'Un idioma', desc: 'Espanol', precio: 0 },
    { id: 'bilingue', label: 'Bilingue', desc: 'Espanol + Ingles', precio: 2400 },
    { id: 'trilingue', label: 'Trilingue', desc: 'Espanol + Ingles + otro', precio: 4200 },
  ],
};

function dbItemsToArray(items: PricingItem[]) {
  return items.map(i => ({
    id: i.item_id,
    label: i.label,
    desc: i.descripcion || undefined,
    precio: i.precio,
    base: i.base,
    multiplicador: i.multiplicador,
    included: i.included === 1 ? true : undefined,
  }));
}

export function getPricing() {
  try {
    const all = getAllPricing();
    if (!all || Object.keys(all).length === 0) return DEFAULT_PRICING;

    return {
      hosting: all.hosting ? dbItemsToArray(all.hosting) : DEFAULT_PRICING.hosting,
      correo: all.correo ? dbItemsToArray(all.correo) : DEFAULT_PRICING.correo,
      tipoSitio: all.tipoSitio ? dbItemsToArray(all.tipoSitio) : DEFAULT_PRICING.tipoSitio,
      paginaExtra: getPaginaExtra(),
      diseno: all.diseno ? dbItemsToArray(all.diseno) : DEFAULT_PRICING.diseno,
      funcionalidades: all.funcionalidades ? dbItemsToArray(all.funcionalidades) : DEFAULT_PRICING.funcionalidades,
      extras: all.extras ? dbItemsToArray(all.extras) : DEFAULT_PRICING.extras,
      urgencia: all.urgencia ? dbItemsToArray(all.urgencia) : DEFAULT_PRICING.urgencia,
      mantenimiento: all.mantenimiento ? dbItemsToArray(all.mantenimiento) : DEFAULT_PRICING.mantenimiento,
      idiomas: all.idiomas ? dbItemsToArray(all.idiomas) : DEFAULT_PRICING.idiomas,
    };
  } catch {
    return DEFAULT_PRICING;
  }
}

// Keep PRICING as a getter for backward compatibility
export const PRICING = DEFAULT_PRICING;

export type QuoteData = {
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  tipo_sitio: string;
  num_paginas: number;
  diseno: string;
  hosting: string;
  correo: string;
  funcionalidades: string[];
  extras: string[];
  urgencia: string;
  mantenimiento: string;
  idiomas: string;
  total: number;
};

export function calculateTotal(data: Omit<QuoteData, 'total' | 'nombre' | 'email' | 'telefono' | 'empresa'>): { total: number; totalMensual: number; items: { categoria: string; nombre: string; precio: number }[]; itemsMensuales: { categoria: string; nombre: string; precio: number }[] } {
  const pricing = getPricing();
  const items: { categoria: string; nombre: string; precio: number }[] = [];
  const itemsMensuales: { categoria: string; nombre: string; precio: number }[] = [];

  // Tipo de sitio base
  const tipo = pricing.tipoSitio.find((t: any) => t.id === data.tipo_sitio);
  if (tipo) items.push({ categoria: 'base', nombre: tipo.label, precio: tipo.base || 0 });

  // Paginas extra
  const basePaginas = tipo?.id === 'landing' ? 1 : tipo?.id === 'basico' ? 4 : tipo?.id === 'profesional' ? 8 : 12;
  if (data.num_paginas > basePaginas) {
    const extra = (data.num_paginas - basePaginas) * pricing.paginaExtra;
    items.push({ categoria: 'base', nombre: `${data.num_paginas - basePaginas} paginas extra`, precio: extra });
  }

  // Diseno
  const dis = pricing.diseno.find((d: any) => d.id === data.diseno);
  if (dis && dis.precio > 0) items.push({ categoria: 'diseno', nombre: dis.label, precio: dis.precio });

  // Funcionalidades
  for (const fid of data.funcionalidades) {
    const f = pricing.funcionalidades.find((x: any) => x.id === fid);
    if (f && f.precio > 0) items.push({ categoria: 'funcionalidad', nombre: f.label, precio: f.precio });
  }

  // Hosting (anual)
  const h = pricing.hosting.find((x: any) => x.id === data.hosting);
  if (h && h.precio > 0) items.push({ categoria: 'hosting', nombre: h.label, precio: h.precio });

  // Correo (anual)
  const c = pricing.correo.find((x: any) => x.id === data.correo);
  if (c && c.precio > 0) items.push({ categoria: 'correo', nombre: c.label, precio: c.precio });

  // Extras
  for (const eid of data.extras) {
    const e = pricing.extras.find((x: any) => x.id === eid);
    if (e && e.precio > 0) items.push({ categoria: 'extra', nombre: e.label, precio: e.precio });
  }

  // Idiomas
  const idioma = pricing.idiomas.find((x: any) => x.id === data.idiomas);
  if (idioma && idioma.precio > 0) items.push({ categoria: 'idioma', nombre: idioma.label, precio: idioma.precio });

  // Subtotal antes de urgencia
  const subtotal = items.reduce((sum, i) => sum + i.precio, 0);

  // Urgencia (multiplicador sobre el subtotal)
  const urg = pricing.urgencia.find((x: any) => x.id === data.urgencia);
  const multiplicador = urg?.multiplicador ?? 1;
  let total = subtotal;
  if (multiplicador > 1) {
    const recargo = Math.round(subtotal * (multiplicador - 1));
    items.push({ categoria: 'urgencia', nombre: `Entrega ${urg?.label}`, precio: recargo });
    total = subtotal + recargo;
  }

  // Mantenimiento (mensual, no suma al total unico)
  const mant = pricing.mantenimiento.find((x: any) => x.id === data.mantenimiento);
  if (mant && mant.precio > 0) {
    itemsMensuales.push({ categoria: 'mantenimiento', nombre: mant.label, precio: mant.precio });
  }

  const totalMensual = itemsMensuales.reduce((sum, i) => sum + i.precio, 0);
  return { total, totalMensual, items, itemsMensuales };
}
