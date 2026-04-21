/**
 * micrositios.ts - Configuracion de los dominios del ecosistema PZ
 *
 * Lista unica fuente de verdad para el dropdown del admin, validacion
 * de la API y CORS del endpoint publico /api/micrositios/blog.
 */

export type MicrositeInfo = {
  domain: string;
  name: string; // etiqueta humana para el admin
  type: 'landing-geo' | 'blog-satelite' | 'landing-seo' | 'submarca';
  launchMonth: string; // mes de lanzamiento segun el plan
};

export const MICROSITIOS: MicrositeInfo[] = [
  { domain: 'disenowebcdmx.com', name: 'Diseno Web CDMX', type: 'landing-geo', launchMonth: 'Abril 2026' },
  { domain: 'desarrolloweb.me', name: 'Desarrollo Web (Blog)', type: 'blog-satelite', launchMonth: 'Abril 2026' },
  { domain: 'leadboostz.com', name: 'LeadBoost Z', type: 'submarca', launchMonth: 'Abril 2026' },
  { domain: 'agenciawebmonterrey.com', name: 'Agencia Web Monterrey', type: 'landing-geo', launchMonth: 'Mayo 2026' },
  { domain: 'paginaswebmex.com', name: 'Paginas Web Mexico (Blog)', type: 'blog-satelite', launchMonth: 'Mayo 2026' },
  { domain: 'sitioswebguadalajara.com', name: 'Sitios Web Guadalajara', type: 'landing-geo', launchMonth: 'Mayo 2026' },
  { domain: 'desarrollowebyseo.com', name: 'Desarrollo Web y SEO (Blog)', type: 'blog-satelite', launchMonth: 'Junio 2026' },
  { domain: 'sitioswebmerida.com', name: 'Sitios Web Merida', type: 'landing-geo', launchMonth: 'Junio 2026' },
  { domain: 'disenopaginaswebs.com', name: 'Diseno Paginas Web (Blog)', type: 'blog-satelite', launchMonth: 'Junio 2026' },
  { domain: 'sitioswebpuebla.com', name: 'Sitios Web Puebla', type: 'landing-geo', launchMonth: 'Junio 2026' },
  { domain: 'digitalizate360.com', name: 'Digitalizate 360 (Blog)', type: 'blog-satelite', launchMonth: 'Julio 2026' },
  { domain: 'disenowebenmexico.com', name: 'Diseno Web en Mexico (Blog)', type: 'blog-satelite', launchMonth: 'Julio 2026' },
  { domain: 'publicidadydisenoweb.com', name: 'Publicidad y Diseno Web (Blog)', type: 'blog-satelite', launchMonth: 'Julio 2026' },
  { domain: 'paginasweburgentes.com', name: 'Paginas Web Urgentes', type: 'landing-seo', launchMonth: 'Julio 2026' },
  { domain: 'portafolioz.com', name: 'Portafolio Z (hub)', type: 'landing-seo', launchMonth: 'Activo' },
];

export const MICROSITIO_DOMAINS = MICROSITIOS.map((m) => m.domain);

export function isValidDomain(domain: string): boolean {
  return MICROSITIO_DOMAINS.includes(domain);
}

export function getMicrositeByDomain(domain: string): MicrositeInfo | undefined {
  return MICROSITIOS.find((m) => m.domain === domain);
}
