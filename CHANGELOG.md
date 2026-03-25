# Changelog - Portafolio Z 2026

## [1.0.0] - 2026-03-25 - Lanzamiento en Produccion

### Infraestructura
- Sitio desplegado en VPS (76.13.110.57) con Docker
- Dominio `https://portafolioz.com` con SSL Full (Strict) via Cloudflare + Let's Encrypt
- Nginx Proxy Manager como reverse proxy
- Astro v5 con Node adapter en modo SSR/hybrid
- Base de datos SQLite para cotizaciones, proyectos y precios

### Mail Server
- Docker Mailserver (Postfix + Dovecot) en el VPS
- 5 cuentas migradas desde WePanel (cp7019.webempresa.eu) con imapsync
  - administrador@portafolioz.com (15,271 msgs)
  - cori@portafolioz.com (7,695 msgs)
  - info@portafolioz.com (1,515 msgs)
  - hola@portafolioz.com (315 msgs)
  - ivan@portafolioz.com (169 msgs)
- Total: 24,965 mensajes migrados
- Roundcube webmail en `https://mail.portafolioz.com`
- DNS configurados: MX, SPF, DKIM, DMARC

### Sitio Web
- Homepage con 14 secciones: Hero, TrustBar, Services, ServicesPrincipales, WhyUs, Plans, Features, Projects, TechStack, Process, CTA, BlogPreview, Testimonials, ContactForm
- Blog conectado a WordPress REST API (blog.portafolioz.com) - 43+ posts
- Pagina de proyectos con datos de la BD (admin panel)
- Cotizador de 5 pasos con precios editables desde admin
- Pagina 404 personalizada

### Admin Panel (/admin)
- Login con autenticacion por cookie (SHA-256 + HMAC)
- Gestion de cotizaciones (ver, cambiar status, notas)
- Gestion de proyectos (CRUD con subida de imagenes)
- Configuracion de precios del cotizador
- Rate limiting por IP

### Integraciones
- Active Campaign: contactos, tags, listas para cotizaciones y lead magnets
- Nodemailer SMTP: auto-envio de cotizaciones al cliente + notificacion al admin
- Google Analytics GA4 con eventos de conversion
- WhatsApp Business CTA con mensajes pre-escritos por servicio/plan

### SEO
- JSON-LD structured data (Organization + WebSite)
- Meta tags: title, description, canonical, Open Graph, Twitter Cards
- robots.txt con sitemap reference
- Sitemap XML auto-generado (excluye /admin y /api)
- Favicon + apple-touch-icon
- og:image con URL absoluta
- Dimensiones en imagenes para prevenir CLS
- Score estimado: ~92/100

### Seguridad
- CSRF checkOrigin habilitado
- SPF + DKIM + DMARC para email
- Rate limiting en login, cotizaciones y lead magnets
- Cookies HttpOnly + Secure + SameSite
- npm audit: 0 vulnerabilidades
- Admin protegido con noindex, nofollow

### Marketing
- Popup exit-intent de lead magnet (Textos Legales) integrado con Active Campaign
- Popup de urgencia/escasez dinamico (cambia cada mes)
- Botones de planes vinculados a WhatsApp con referencia del servicio
- Seccion de servicios separada: Diseno Web + Marketing Digital

### Componentes Destacados
- TrustBar: logos reales de partners (Analytics, Ads, Bunny, Namecheap, Cloudflare)
- TechStack: carrusel infinito de tecnologias (Astro, React, Tailwind, WordPress, etc.)
- CotizadorModal: wizard flotante con scroll corregido
- ServicesPrincipales: cards con gradientes solidos por servicio

---

## Stack Tecnologico
- **Framework:** Astro v5 + TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** SQLite via better-sqlite3
- **Email:** Nodemailer + Docker Mailserver
- **CMS:** WordPress (headless via REST API)
- **Hosting:** VPS con Docker + Nginx Proxy Manager
- **CDN/DNS:** Cloudflare
- **Analytics:** Google Analytics GA4
- **CRM:** Active Campaign
- **Repo:** github.com/Tennibel/portafolioz-26
