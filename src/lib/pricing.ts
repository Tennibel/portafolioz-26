/**
 * pricing.ts - Fuente unica de verdad para precios del cotizador
 * Los precios estan en pesos MXN (enteros, sin centavos)
 */

export const PRICING = {
  tipoSitio: [
    { id: 'landing', label: 'Landing Page', desc: '1-3 secciones', base: 5600 },
    { id: 'basico', label: 'Sitio Basico', desc: '2-4 secciones', base: 6400 },
    { id: 'profesional', label: 'Sitio Profesional', desc: '5-8 secciones', base: 7300 },
    { id: 'empresarial', label: 'Sitio Empresarial', desc: '9-12 secciones', base: 8900 },
  ],
  paginaExtra: 800,
  diseno: [
    { id: 'plantilla', label: 'Plantilla personalizada', precio: 0 },
    { id: 'desde_cero', label: 'Diseno desde cero', precio: 2500 },
  ],
  funcionalidades: [
    { id: 'contacto', label: 'Formulario de contacto', precio: 0, included: true },
    { id: 'blog', label: 'Blog integrado', precio: 390 },
    { id: 'catalogo', label: 'Catalogo de productos', precio: 2900 },
    { id: 'entregas', label: 'Sistema de entregas', precio: 3800 },
    { id: 'tienda', label: 'Tienda online', precio: 3800 },
    { id: 'citas', label: 'Sistema de citas', precio: 3200 },
    { id: 'cotizador', label: 'Cotizador', precio: 1200 },
    { id: 'crm', label: 'CRM', precio: 1200 },
  ],
  hosting: [
    { id: 'propio', label: 'Ya tengo hosting', precio: 0 },
    { id: '5gb', label: 'Dominio + 5GB', precio: 650 },
    { id: '10gb', label: 'Dominio + 10GB', precio: 890 },
    { id: '15gb', label: 'Dominio + 15GB', precio: 1290 },
  ],
  correo: [
    { id: 'sin', label: 'Sin correos', precio: 0 },
    { id: '2cuentas', label: '2 cuentas', precio: 220 },
    { id: '6cuentas', label: '6 cuentas', precio: 320 },
    { id: 'ilimitado', label: 'Ilimitado', precio: 900 },
  ],
  extras: [
    { id: 'whatsapp', label: 'Boton WhatsApp', precio: 500 },
    { id: 'chatbot', label: 'Chatbot', precio: 4200 },
    { id: 'localizador', label: 'Localizador de tiendas', precio: 900 },
    { id: 'lector_pdf', label: 'Lector PDF', precio: 350 },
    { id: 'seo_avanzado', label: 'SEO avanzado', precio: 1200 },
    { id: 'analytics', label: 'Google Analytics', precio: 0, included: true },
    { id: 'ssl', label: 'Certificado SSL', precio: 0, included: true },
  ],
} as const;

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
  total: number;
};

export function calculateTotal(data: Omit<QuoteData, 'total' | 'nombre' | 'email' | 'telefono' | 'empresa'>): { total: number; items: { categoria: string; nombre: string; precio: number }[] } {
  const items: { categoria: string; nombre: string; precio: number }[] = [];

  // Tipo de sitio base
  const tipo = PRICING.tipoSitio.find(t => t.id === data.tipo_sitio);
  if (tipo) items.push({ categoria: 'base', nombre: tipo.label, precio: tipo.base });

  // Paginas extra (above the tipo's included pages)
  const basePaginas = tipo?.id === 'landing' ? 3 : tipo?.id === 'basico' ? 4 : tipo?.id === 'profesional' ? 8 : 12;
  if (data.num_paginas > basePaginas) {
    const extra = (data.num_paginas - basePaginas) * PRICING.paginaExtra;
    items.push({ categoria: 'base', nombre: `${data.num_paginas - basePaginas} paginas extra`, precio: extra });
  }

  // Diseno
  const dis = PRICING.diseno.find(d => d.id === data.diseno);
  if (dis && dis.precio > 0) items.push({ categoria: 'diseno', nombre: dis.label, precio: dis.precio });

  // Funcionalidades
  for (const fid of data.funcionalidades) {
    const f = PRICING.funcionalidades.find(x => x.id === fid);
    if (f && f.precio > 0) items.push({ categoria: 'funcionalidad', nombre: f.label, precio: f.precio });
  }

  // Hosting
  const h = PRICING.hosting.find(x => x.id === data.hosting);
  if (h && h.precio > 0) items.push({ categoria: 'hosting', nombre: h.label, precio: h.precio });

  // Correo
  const c = PRICING.correo.find(x => x.id === data.correo);
  if (c && c.precio > 0) items.push({ categoria: 'correo', nombre: c.label, precio: c.precio });

  // Extras
  for (const eid of data.extras) {
    const e = PRICING.extras.find(x => x.id === eid);
    if (e && e.precio > 0) items.push({ categoria: 'extra', nombre: e.label, precio: e.precio });
  }

  const total = items.reduce((sum, i) => sum + i.precio, 0);
  return { total, items };
}
