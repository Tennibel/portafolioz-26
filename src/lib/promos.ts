/**
 * promos.ts - Configuracion de promociones mensuales para el popup de urgencia.
 *
 * Cada entrada define el mensaje y lugares disponibles para un mes.
 * Si el mes actual no tiene entrada, se usa `defaultPromo`.
 * La key es "YYYY-MM" (ej: "2026-04").
 */

type Promo = {
  emoji: string;
  texto: string;
  lugares: number;
};

const promos: Record<string, Promo> = {
  '2026-03': { emoji: '🔥', texto: '20% de descuento en tu primer sitio web', lugares: 7 },
  '2026-04': { emoji: '🚀', texto: '15% de descuento en paquetes de diseño web', lugares: 5 },
  '2026-05': { emoji: '💡', texto: 'Consultoría SEO gratis con tu sitio web', lugares: 6 },
  '2026-06': { emoji: '☀️', texto: 'Promo de verano: 25% en desarrollo web', lugares: 8 },
  '2026-07': { emoji: '⚡', texto: 'Landing page + dominio desde $3,800 MXN', lugares: 5 },
  '2026-08': { emoji: '🎯', texto: 'Sitio web + SEO básico con 20% de descuento', lugares: 6 },
  '2026-09': { emoji: '📈', texto: 'Growth Marketing: primer mes con 30% OFF', lugares: 4 },
  '2026-10': { emoji: '🎃', texto: 'Promo de octubre: branding + web desde $7,500', lugares: 5 },
  '2026-11': { emoji: '🛒', texto: 'Buen Fin: 30% en todos los paquetes web', lugares: 10 },
  '2026-12': { emoji: '🎄', texto: 'Cierre de año: 20% en sitios empresariales', lugares: 6 },
};

const defaultPromo: Promo = {
  emoji: '🔥',
  texto: '15% de descuento en tu primer sitio web',
  lugares: 5,
};

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export function getCurrentPromo(): { emoji: string; mesAnio: string; texto: string; lugares: number } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const key = `${year}-${String(month + 1).padStart(2, '0')}`;
  const promo = promos[key] || defaultPromo;
  return {
    emoji: promo.emoji,
    mesAnio: `${MESES[month]} ${year}`,
    texto: promo.texto,
    lugares: promo.lugares,
  };
}
