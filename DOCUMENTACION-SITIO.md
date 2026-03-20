# Portafolio Z - Documentacion Completa del Sitio Web

**Proyecto:** portafolioz.com
**Stack:** Astro 6 + Tailwind CSS v4 + SQLite + Resend
**Deploy:** Docker en Hostinger VPS (76.13.110.57)
**Ultima actualizacion:** 20 Marzo 2026

---

## Resumen General

Sitio web completo para la agencia de diseno web **Portafolio Z**, que incluye:
- Sitio marketing publico (27 paginas)
- Landings sectoriales (5 industrias)
- Panel de administracion (6 paginas)
- API REST (7 endpoints)
- Cotizador interactivo en tiempo real
- Blog con integracion WordPress REST API
- Sistema de gestion de cotizaciones y proyectos
- Envio de emails automatizado
- Mega menu con todos los servicios

---

## 1. PAGINAS PUBLICAS (27)

### Paginas Principales

#### 1.1 Pagina Principal (`/`)
**Archivo:** `src/pages/index.astro`
**Secciones:** Hero, TrustBar, Services, WhyUs, Plans, Features, Projects, TechStack, Process, CtaSection, BlogPreview, Testimonials, ContactForm, Footer
**Descripcion:** Landing principal con 14 secciones de venta. Estadisticas, portafolio, testimonios y formulario de contacto.

#### 1.2 Nosotros (`/nosotros`)
**Archivo:** `src/pages/nosotros.astro`
**Descripcion:** Historia de la empresa desde 2013, equipo (Corina Alquicira, Ivan Gomez, Hugo Alquicira), timeline, estadisticas y valores.

#### 1.3 Servicios (`/servicios`)
**Archivo:** `src/pages/servicios.astro`
**Descripcion:** 6 servicios principales, planes de hosting, tipos de sitio web, integraciones, opciones de correo y extras.

#### 1.4 Contacto (`/contacto`)
**Archivo:** `src/pages/contacto.astro`
**Descripcion:** 4 metodos de contacto (email, telefono, WhatsApp, oficina), formulario, horarios y FAQs.

#### 1.5 Blog (`/blog`)
**Archivo:** `src/pages/blog.astro`
**Descripcion:** Listado de articulos con integracion WordPress REST API (variable `WP_API_URL`). Incluye buscador en tiempo real, filtros por categoria, articulo destacado, secciones por categoria y fallback a posts mock. Tema oscuro.

#### 1.6 Proyectos (`/proyectos-desarrollo-web`)
**Archivo:** `src/pages/proyectos-desarrollo-web.astro`
**Descripcion:** Portafolio publico con scroll infinito. Obtiene proyectos visibles de la base de datos via API.

#### 1.7 Cotizador (`/cotizador`)
**Archivo:** `src/pages/cotizador.astro`
**Descripcion:** Calculadora de precios con wizard de 4 pasos para generar cotizaciones en tiempo real.

#### 1.8 Paquetes Digitales (`/paquetes-digitales`)
**Archivo:** `src/pages/paquetes-digitales.astro`
**Descripcion:** Pagina comparadora de todos los servicios digitales. 3 categorias (Web, Marketing, LeadBoost), 10 planes, combos con descuentos. Animaciones CSS (orbes flotantes, gradiente texto, pulse). Muy visual.

### Servicios Principales

#### 1.9 Web Sales Machine (`/web-sales-machine`)
**Archivo:** `src/pages/web-sales-machine.astro`
**Secciones:** Hero, Barra de urgencia, Pain points (3 columnas), Propuesta de valor (6 beneficios), 4 Planes con tabla comparativa, Proceso en 4 pasos, Tecnologia, 4 Testimonios, 10 FAQs, CTA final
**Descripcion:** Landing principal de diseno web. 11 secciones. Tema indigo/cyan. 4 planes desde $3,800 MXN.

#### 1.10 Growth Marketing (`/growth-marketing`)
**Archivo:** `src/pages/growth-marketing.astro`
**Secciones:** Hero, Problema, Servicios detallados (Google Ads, Meta Ads, Dashboard), 3 Planes mensuales, Resultados con contadores, FAQs, CTA final
**Descripcion:** Gestion profesional de Google Ads y Meta Ads. 7 secciones. Tema naranja/ambar. 3 planes desde $4,500/mes.

#### 1.11 LeadBoost Z (`/leadboost-z`)
**Archivo:** `src/pages/leadboost-z.astro`
**Secciones:** Hero, Problema, 3 Pilares (LeadCapture, NurtureFlow, ConvertX), 3 Planes mensuales, FAQs, CTA final
**Descripcion:** Automatizacion de ventas con IA. 6 secciones. Tema esmeralda/neon. 3 planes desde $6,900/mes.

### Landings para Ads

#### 1.12 Paquetes para Emprendedores (`/paquetes-para-emprendedores`)
**Archivo:** `src/pages/paquetes-para-emprendedores.astro`
**Descripcion:** 4 servicios digitales y 3 planes de precios orientados a emprendedores.

#### 1.13 Diseno de Paginas Web (`/diseno-paginas-web`)
**Archivo:** `src/pages/diseno-paginas-web.astro`
**Descripcion:** Landing optimizada para campanas Google/Meta Ads. Hero, servicios, 3 planes, portafolio, FAQs.

#### 1.14 Diseno Web Profesional (`/diseno-web-profesional`)
**Archivo:** `src/pages/diseno-web-profesional.astro`
**Descripcion:** Pagina de servicio de diseno web profesional con 3 niveles de precio y servicios adicionales.

#### 1.15 Diseno Web CDMX (`/diseno-web-cdmx`)
**Archivo:** `src/pages/diseno-web-cdmx.astro`
**Descripcion:** Landing de diseno web en Ciudad de Mexico. 3 pilares, features, 3 planes, testimonios, FAQs.

#### 1.16 Consultoria Marketing Digital (`/consultoria-marketing-digital`)
**Archivo:** `src/pages/consultoria-marketing-digital.astro`
**Descripcion:** Oferta de consultoria gratuita de 30 minutos en marketing digital.

### Landings Sectoriales

#### 1.17 Medicos y Clinicas (`/sector/medicos`)
**Archivo:** `src/pages/sector/medicos.astro`
**Secciones:** Hero split con imagen, 8 features especializados, Caso real (Clinica Dental +200% consultas), 3 planes recomendados, CTA
**Descripcion:** Landing para consultorios medicos. Tema cyan/teal. Placeholders de imagen.

#### 1.18 Inmobiliarias (`/sector/inmobiliarias`)
**Archivo:** `src/pages/sector/inmobiliarias.astro`
**Secciones:** Hero split con imagen, 8 features (catalogo, filtros, fichas), 3 planes recomendados, CTA
**Descripcion:** Landing para inmobiliarias. Tema ambar/naranja. Placeholders de imagen.

#### 1.19 Hoteles (`/sector/hoteles`)
**Archivo:** `src/pages/sector/hoteles.astro`
**Secciones:** Hero split con imagen, 8 features (reservaciones, galeria, multiidioma), Caso real (Hotel Boutique +150% reservaciones), 3 planes, CTA
**Descripcion:** Landing para hoteles. Tema violeta/rosa. Placeholders de imagen.

#### 1.20 Restaurantes (`/sector/restaurantes`)
**Archivo:** `src/pages/sector/restaurantes.astro`
**Secciones:** Hero split con imagen, 8 features (menu digital, reservaciones), Caso real (Restaurante Roma 30 reservaciones/semana), 3 planes, CTA
**Descripcion:** Landing para restaurantes. Tema rojo/naranja. Placeholders de imagen.

#### 1.21 Escuelas (`/sector/escuelas`)
**Archivo:** `src/pages/sector/escuelas.astro`
**Secciones:** Hero split con imagen, 8 features (inscripciones, portal padres), Caso real (Academia Ingles 45 inscripciones/mes), 3 planes, CTA
**Descripcion:** Landing para escuelas. Tema azul/indigo. Placeholders de imagen.

### Promociones

#### 1.22 Promocion Cyber Days (`/promocion-cyber-days`)
**Archivo:** `src/pages/promocion-cyber-days.astro`
**Descripcion:** Campana Cyber Days 2026 (1-5 diciembre) con 10% descuento + 3 MSI.

#### 1.23 Promocion Buen Fin (`/promocion-buen-fin`)
**Archivo:** `src/pages/promocion-buen-fin.astro`
**Descripcion:** Campana Buen Fin 2026 (20-23 noviembre) con 10% de descuento.

### Legales

#### 1.24 Aviso Legal (`/aviso-legal`)
**Archivo:** `src/pages/aviso-legal.astro`

#### 1.25 Aviso de Privacidad (`/aviso-de-privacidad`)
**Archivo:** `src/pages/aviso-de-privacidad.astro`

#### 1.26 Politica de Cookies (`/politica-de-cookies`)
**Archivo:** `src/pages/politica-de-cookies.astro`

---

## 2. PANEL DE ADMINISTRACION (6 paginas)

Todas las paginas admin estan protegidas con autenticacion por cookie.

| # | Ruta | Archivo | Descripcion |
|---|------|---------|-------------|
| 2.1 | `/admin` | `admin/index.astro` | Login con contrasena |
| 2.2 | `/admin/cotizaciones` | `admin/cotizaciones.astro` | Dashboard de cotizaciones con estadisticas y paginacion |
| 2.3 | `/admin/cotizaciones/[id]` | `admin/cotizaciones/[id].astro` | Detalle de cotizacion con items y gestion de estatus |
| 2.4 | `/admin/proyectos` | `admin/proyectos/index.astro` | Lista de proyectos con filtros y estadisticas |
| 2.5 | `/admin/proyectos/nuevo` | `admin/proyectos/nuevo.astro` | Crear proyecto con imagen |
| 2.6 | `/admin/proyectos/[id]` | `admin/proyectos/[id].astro` | Editar proyecto con imagen y opcion eliminar |

---

## 3. COMPONENTES (18)

| Componente | Archivo | Descripcion |
|---|---|---|
| Navbar | `Navbar.astro` | **Mega menu** con glassmorphism. Desktop: dropdown 3 columnas (Diseno Web, Marketing & Ads, Por Sector). Mobile: acordeon. Links: Nosotros, Servicios, Paquetes, Proyectos, Blog, Contacto |
| Hero | `Hero.astro` | Hero full-screen con gradientes, CTAs y estadisticas |
| TrustBar | `TrustBar.astro` | Barra de logos de marcas/herramientas (6 logos, grayscale con hover) |
| Services | `Services.astro` | Grid de 8 servicios con iconos emoji y descripciones hover |
| WhyUs | `WhyUs.astro` | "Nuestra Historia" con 4 tarjetas de razones |
| Plans | `Plans.astro` | 4 planes de precios con colores por plan (cyan, violeta, ambar, rosa). Fondo oscuro con gradientes |
| Features | `Features.astro` | 6 caracteristicas incluidas en todos los planes |
| Projects | `Projects.astro` | Galeria de portafolio con 6 proyectos en grid de 3 columnas |
| TechStack | `TechStack.astro` | 12 tecnologias (Analytics, Cloudflare, WordPress, Astro, etc.) |
| Process | `Process.astro` | 4 pasos del proceso con numeracion gradiente |
| BlogPreview | `BlogPreview.astro` | Preview de 3 articulos. Integracion WP REST API con fallback mock. Tema oscuro con imagenes |
| Testimonials | `Testimonials.astro` | 3 testimonios con avatares y ratings |
| CtaSection | `CtaSection.astro` | Llamada a la accion con gradiente naranja/ambar |
| ContactForm | `ContactForm.astro` | Formulario a 2 columnas con info de contacto |
| Cotizador | `Cotizador.astro` | Wizard 4 pasos con calculo en tiempo real (vanilla JS) |
| CotizadorModal | `CotizadorModal.astro` | Modal wrapper con backdrop y escape |
| WhatsAppWidget | `WhatsAppWidget.astro` | Boton flotante de WhatsApp (inferior derecha) |
| Footer | `Footer.astro` | Footer 3 columnas con CTA, contacto, redes y newsletter |

---

## 4. MEGA MENU (Navbar)

El navbar incluye un mega menu desplegable en "Servicios":

| Diseno Web (cyan) | Marketing & Ads (ambar) | Por Sector (violeta) |
|---|---|---|
| Web Sales Machine | Growth Marketing | Medicos y Clinicas |
| Paquetes para Emprendedores | LeadBoost Z | Inmobiliarias |
| Cotizador Web | Consultoria Digital | Hoteles |
| | | Restaurantes |
| | | Escuelas |

- Desktop: hover con dropdown glassmorphism, iconos y descripciones
- Mobile: acordeon dentro del menu hamburguesa

---

## 5. API ENDPOINTS (7)

### Publicos

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/projects` | Proyectos visibles con paginacion (params: page, categoria) |
| POST | `/api/quote` | Enviar cotizacion (valida, recalcula, guarda en BD, envia emails) |

### Admin (protegidos)

| Metodo | Ruta | Descripcion |
|---|---|---|
| POST | `/api/admin/login` | Autenticacion |
| POST | `/api/admin/logout` | Cerrar sesion |
| POST | `/api/admin/projects` | Crear proyecto con imagen |
| PATCH | `/api/admin/projects/[id]` | Actualizar proyecto |
| DELETE | `/api/admin/projects/[id]` | Eliminar proyecto e imagen |
| GET | `/api/admin/quotes/[id]` | Detalle de cotizacion |
| PATCH | `/api/admin/quotes/[id]` | Actualizar estatus de cotizacion |

---

## 6. BASE DE DATOS (SQLite)

**Motor:** better-sqlite3
**Ubicacion:** `/app/data/cotizador.db` (Docker) | `data/cotizador.db` (local)

### Tabla: quotes
| Campo | Tipo | Descripcion |
|---|---|---|
| id | INTEGER | Primary key autoincrement |
| nombre | TEXT | Nombre del cliente |
| email | TEXT | Email del cliente |
| telefono | TEXT | Telefono del cliente |
| empresa | TEXT | Nombre de la empresa |
| tipo_sitio | TEXT | Tipo de sitio seleccionado |
| num_paginas | INTEGER | Numero de paginas |
| diseno | TEXT | Tipo de diseno |
| hosting | TEXT | Plan de hosting |
| correo | TEXT | Plan de correo |
| total | REAL | Total calculado en MXN |
| status | TEXT | nueva, contactada, cerrada, descartada |
| notas_admin | TEXT | Notas internas del admin |
| created_at | DATETIME | Fecha de creacion |
| updated_at | DATETIME | Ultima actualizacion |

### Tabla: quote_items
| Campo | Tipo | Descripcion |
|---|---|---|
| id | INTEGER | Primary key autoincrement |
| quote_id | INTEGER | FK a quotes |
| categoria | TEXT | Categoria del item |
| nombre | TEXT | Nombre del item |
| precio | REAL | Precio en MXN |

### Tabla: projects
| Campo | Tipo | Descripcion |
|---|---|---|
| id | INTEGER | Primary key autoincrement |
| nombre | TEXT | Nombre del proyecto |
| slug | TEXT | URL slug (unique) |
| url | TEXT | URL del sitio |
| categoria | TEXT | Categoria del proyecto |
| descripcion | TEXT | Descripcion |
| imagen | TEXT | Ruta de la imagen |
| featured | INTEGER | Destacado (0/1) |
| visible | INTEGER | Visible publicamente (0/1) |
| orden | INTEGER | Orden de aparicion |
| created_at | DATETIME | Fecha de creacion |
| updated_at | DATETIME | Ultima actualizacion |

---

## 7. LIBRERIAS DEL SISTEMA (src/lib/)

| Archivo | Descripcion |
|---|---|
| `db.ts` | Capa de base de datos SQLite con funciones CRUD para quotes y projects |
| `pricing.ts` | Configuracion de precios y funcion calculateTotal() para cotizaciones |
| `auth.ts` | Autenticacion con cookies HMAC-SHA256 firmadas (24h expiry) |
| `email.ts` | Envio de emails via Resend API (notificacion admin + confirmacion cliente) |
| `upload.ts` | Manejo de subida de imagenes (JPEG/PNG/WebP, max 5MB) |

---

## 8. PAQUETES Y PRECIOS

### Paquetes Web (Homepage + Web Sales Machine)

| Plan | Precio | Renovacion | Entrega | Destacado |
|---|---|---|---|---|
| Landing Performance | $3,800 + IVA | $1,840/ano | 7 dias | Campanas y emprendedores |
| Web Corporativa | $6,400 + IVA | $2,450/ano | 15 dias | **MAS POPULAR** |
| Web SEO Performance | $8,900 + IVA | $3,140/ano | 20 dias | Crecer con Google |
| Headless Premium | $10,600 + IVA | $3,860/ano | 25 dias | CMS Blog + desarrollo a medida |

### Planes Growth Marketing

| Plan | Precio | Descripcion |
|---|---|---|
| Campana Google Ads | Desde $4,500/mes | Busqueda, display, remarketing |
| Campana Meta Ads | Desde $4,500/mes | Facebook + Instagram |
| Paquete Integral | Desde $7,500/mes | **RECOMENDADO** - Google + Meta + Dashboard |

### Planes LeadBoost Z

| Plan | Precio | Descripcion |
|---|---|---|
| Starter Automation | $6,900/mes | Chatbot basico + Google Ads |
| Funnel Automation | $8,600/mes | **MAS POPULAR** - CRM + WhatsApp avanzado |
| AI Sales System | $12,900/mes | IA completa + coaching mensual |

### Combos (Paquetes Digitales)

| Combo | Incluye | Precio |
|---|---|---|
| Web + Ads | Corporativa + Google Ads | $10,400/mes (ahorra $500) |
| Web + LeadBoost | SEO + Starter | $15,300/mes (ahorra $500) |
| Full Stack Digital | Web + Ads + LeadBoost | Cotizacion personalizada |

### Precios del Cotizador

**Tipos de Sitio:** Landing $5,600 | Basico $6,400 | Profesional $7,300 | Empresarial $8,900
**Pagina Extra:** $800 MXN
**Diseno:** Plantilla $0 | Desde cero $2,500
**Funcionalidades:** Blog $390 | Catalogo $2,900 | Entregas $3,800 | Tienda $3,800 | Citas $3,200 | Cotizador $1,200 | CRM $1,200
**Hosting:** 5GB $650 | 10GB $890 | 15GB $1,290
**Correo:** Sin $0 | 2 cuentas $220 | 6 cuentas $320 | Ilimitado $900
**Extras:** WhatsApp $500 | Chatbot $4,200 | Localizador $900 | Lector PDF $350 | SEO avanzado $1,200

---

## 9. LAYOUTS (2)

| Layout | Archivo | Uso |
|---|---|---|
| Layout | `src/layouts/Layout.astro` | Paginas publicas. Meta tags, OG, ViewTransitions, scroll animations, CotizadorModal, WhatsApp |
| AdminLayout | `src/layouts/AdminLayout.astro` | Panel admin. Sin navbar/footer publico, header con logo ico y links admin, noindex |

---

## 10. ASSETS (public/)

### Logos (`public/img/logo/`)
| Archivo | Uso | Donde se usa |
|---|---|---|
| `logo-light.png` | Texto blanco + Z colorida | Navbar, Footer (fondos oscuros) |
| `logo-dark.png` | Texto negro + Z colorida | Fondos claros |
| `logo-ico.png` | Solo la Z colorida | Favicon, Admin header, Admin login |

### Imagenes sectoriales (`public/img/sectores/`)
Placeholders para las landings sectoriales. Formato `.webp` recomendado:
- `medicos-hero.webp`, `medicos-consultorio.webp`, `medicos-citas.webp`
- `inmobiliarias-hero.webp`, `inmobiliarias-catalogo.webp`, `inmobiliarias-ficha.webp`
- `hoteles-hero.webp`, `hoteles-habitacion.webp`, `hoteles-amenidades.webp`
- `restaurantes-hero.webp`, `restaurantes-menu.webp`, `restaurantes-platillos.webp`
- `escuelas-hero.webp`, `escuelas-portal.webp`, `escuelas-instalaciones.webp`

---

## 11. VARIABLES DE ENTORNO

```
# Autenticacion
ADMIN_PASSWORD=tu_contrasena_segura
COOKIE_SECRET=tu_clave_secreta

# Base de datos
DB_PATH=/app/data/cotizador.db

# Email
RESEND_API_KEY=re_xxxxx

# Blog (WordPress)
WP_API_URL=https://tu-wordpress.com

# Subida de archivos
UPLOAD_DIR=/app/uploads/projects

# Servidor
HOST=0.0.0.0
PORT=4000

# Opcional
SITE_URL=https://portafolioz.com
```

---

## 12. DEPLOY Y INFRAESTRUCTURA

### Produccion
- **VPS:** Hostinger (IP: 76.13.110.57)
- **SO:** Linux
- **Contenedor:** Docker con docker-compose
- **Imagen:** `portafolioz:latest` (linux/amd64)
- **Puerto:** 4000
- **Volumenes:** data/ (SQLite) y uploads/ (imagenes)

### Proceso de Deploy
1. Build local de imagen Docker (`docker build --platform linux/amd64`)
2. Exportar imagen a .tar.gz
3. Subir al VPS via rsync
4. Cargar imagen en Docker del servidor
5. Copiar docker-compose.prod.yml
6. Reiniciar contenedor

### Script: `deploy.sh`

---

## 13. DEPENDENCIAS

### Produccion
| Paquete | Version | Uso |
|---|---|---|
| astro | ^6.0.2 | Framework web |
| @astrojs/node | ^10.0.0 | Adaptador Node.js SSR |
| tailwindcss | ^4.2.1 | Framework CSS |
| @tailwindcss/vite | ^4.2.1 | Plugin Vite para Tailwind |
| better-sqlite3 | ^12.6.2 | Base de datos SQLite |
| resend | ^6.9.3 | Envio de emails |

### Desarrollo
| Paquete | Version | Uso |
|---|---|---|
| @types/better-sqlite3 | ^7.6.13 | Tipos TypeScript |

---

## 14. ESTADISTICAS DEL PROYECTO

| Metrica | Cantidad |
|---|---|
| Paginas publicas | 27 |
| Paginas admin | 6 |
| Componentes | 18 |
| Layouts | 2 |
| Endpoints API | 7 |
| Archivos lib | 5 |
| Tablas BD | 3 |
| Landings sectoriales | 5 |
| Servicios principales | 3 (Web, Marketing, LeadBoost) |
| Planes de precio | 10 |
| **Total archivos fuente** | **75+** |
