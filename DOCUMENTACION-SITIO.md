# Portafolio Z - Documentacion Completa del Sitio Web

**Proyecto:** portafolioz.com
**Stack:** Astro 6 + Tailwind CSS v4 + SQLite + Resend
**Deploy:** Docker en Hostinger VPS (76.13.110.57)
**Ultima actualizacion:** Marzo 2026

---

## Resumen General

Sitio web completo para la agencia de diseno web **Portafolio Z**, que incluye:
- Sitio marketing publico (17 paginas)
- Panel de administracion (6 paginas)
- API REST (7 endpoints)
- Cotizador interactivo en tiempo real
- Sistema de gestion de cotizaciones y proyectos
- Envio de emails automatizado

---

## 1. PAGINAS PUBLICAS (17)

### 1.1 Pagina Principal (`/`)
**Archivo:** `src/pages/index.astro`
**Secciones:** Hero, TrustBar, Services, WhyUs, Plans, Features, Projects, TechStack, Process, CtaSection, BlogPreview, Testimonials, ContactForm, Footer
**Descripcion:** Landing principal con todas las secciones de venta. Incluye estadisticas, portafolio, testimonios y formulario de contacto.

### 1.2 Nosotros (`/nosotros`)
**Archivo:** `src/pages/nosotros.astro`
**Descripcion:** Historia de la empresa desde 2013, equipo (Corina Alquicira, Ivan Gomez, Hugo Alquicira), timeline, estadisticas y valores.

### 1.3 Servicios (`/servicios`)
**Archivo:** `src/pages/servicios.astro`
**Descripcion:** 6 servicios principales, planes de hosting, tipos de sitio web, integraciones, opciones de correo y extras disponibles.

### 1.4 Contacto (`/contacto`)
**Archivo:** `src/pages/contacto.astro`
**Descripcion:** 4 metodos de contacto (email, telefono, WhatsApp, oficina), formulario de contacto, horarios y FAQs.

### 1.5 Blog (`/blog`)
**Archivo:** `src/pages/blog.astro`
**Descripcion:** Listado de articulos con posts sobre SEO, seguridad web y marketing (3 articulos destacados).

### 1.6 Proyectos (`/proyectos-desarrollo-web`)
**Archivo:** `src/pages/proyectos-desarrollo-web.astro`
**Descripcion:** Portafolio publico con scroll infinito. Obtiene proyectos visibles de la base de datos via API.

### 1.7 Cotizador (`/cotizador`)
**Archivo:** `src/pages/cotizador.astro`
**Descripcion:** Calculadora de precios con wizard de 4 pasos para generar cotizaciones en tiempo real.

### 1.8 Paquetes para Emprendedores (`/paquetes-para-emprendedores`)
**Archivo:** `src/pages/paquetes-para-emprendedores.astro`
**Descripcion:** 3 niveles de paquetes con beneficios detallados para emprendedores.

### 1.9 Diseno de Paginas Web (`/diseno-paginas-web`)
**Archivo:** `src/pages/diseno-paginas-web.astro`
**Descripcion:** Landing optimizada para campanas de Google/Meta Ads con servicios y precios.

### 1.10 Diseno Web Profesional (`/diseno-web-profesional`)
**Archivo:** `src/pages/diseno-web-profesional.astro`
**Descripcion:** Pagina de servicio de diseno web profesional con 3 niveles de precio.

### 1.11 Diseno Web CDMX (`/diseno-web-cdmx`)
**Archivo:** `src/pages/diseno-web-cdmx.astro`
**Descripcion:** Landing orientada a servicios de diseno web en Ciudad de Mexico.

### 1.12 Consultoria Marketing Digital (`/consultoria-marketing-digital`)
**Archivo:** `src/pages/consultoria-marketing-digital.astro`
**Descripcion:** Oferta de consultoria gratuita de 30 minutos en marketing digital.

### 1.13 Promocion Cyber Days (`/promocion-cyber-days`)
**Archivo:** `src/pages/promocion-cyber-days.astro`
**Descripcion:** Campana Cyber Days 2026 con 10% de descuento + 3 MSI.

### 1.14 Promocion Buen Fin (`/promocion-buen-fin`)
**Archivo:** `src/pages/promocion-buen-fin.astro`
**Descripcion:** Campana Buen Fin 2026 (20-23 noviembre) con 10% de descuento.

### 1.15 Aviso Legal (`/aviso-legal`)
**Archivo:** `src/pages/aviso-legal.astro`
**Descripcion:** Pagina de aviso legal de la empresa.

### 1.16 Aviso de Privacidad (`/aviso-de-privacidad`)
**Archivo:** `src/pages/aviso-de-privacidad.astro`
**Descripcion:** Politica de privacidad y manejo de datos personales.

### 1.17 Politica de Cookies (`/politica-de-cookies`)
**Archivo:** `src/pages/politica-de-cookies.astro`
**Descripcion:** Politica de uso de cookies del sitio.

---

## 2. PANEL DE ADMINISTRACION (6 paginas)

Todas las paginas admin estan protegidas con autenticacion por cookie.

### 2.1 Login (`/admin`)
**Archivo:** `src/pages/admin/index.astro`
**Descripcion:** Formulario de autenticacion con contrasena.

### 2.2 Cotizaciones (`/admin/cotizaciones`)
**Archivo:** `src/pages/admin/cotizaciones.astro`
**Descripcion:** Dashboard de cotizaciones con estadisticas (total, nuevas, contactadas, cerradas, descartadas) y paginacion.

### 2.3 Detalle de Cotizacion (`/admin/cotizaciones/[id]`)
**Archivo:** `src/pages/admin/cotizaciones/[id].astro`
**Descripcion:** Vista detallada de una cotizacion con items agrupados por categoria y gestion de estatus.

### 2.4 Proyectos (`/admin/proyectos`)
**Archivo:** `src/pages/admin/proyectos/index.astro`
**Descripcion:** Lista de proyectos con filtrado por categoria y estadisticas.

### 2.5 Nuevo Proyecto (`/admin/proyectos/nuevo`)
**Archivo:** `src/pages/admin/proyectos/nuevo.astro`
**Descripcion:** Formulario para crear proyecto con subida de imagen.

### 2.6 Editar Proyecto (`/admin/proyectos/[id]`)
**Archivo:** `src/pages/admin/proyectos/[id].astro`
**Descripcion:** Formulario de edicion con subida de imagen y opcion de eliminar.

---

## 3. COMPONENTES (18)

| Componente | Archivo | Descripcion |
|---|---|---|
| Navbar | `Navbar.astro` | Barra de navegacion fija con glassmorphism, menu hamburguesa movil |
| Hero | `Hero.astro` | Seccion hero full-screen con gradientes, CTAs y estadisticas |
| TrustBar | `TrustBar.astro` | Barra de logos de marcas/herramientas (6 logos, grayscale con hover) |
| Services | `Services.astro` | Grid de 8 servicios con iconos emoji y descripciones hover |
| WhyUs | `WhyUs.astro` | Seccion "Nuestra Historia" con 4 tarjetas de razones |
| Plans | `Plans.astro` | 4 planes de precios con colores por plan (cyan, violeta, ambar, rosa) |
| Features | `Features.astro` | 6 caracteristicas incluidas en todos los planes |
| Projects | `Projects.astro` | Galeria de portafolio con 6 proyectos en grid de 3 columnas |
| TechStack | `TechStack.astro` | 12 tecnologias utilizadas (Analytics, Cloudflare, WordPress, Astro, etc.) |
| Process | `Process.astro` | Flujo de trabajo en 4 pasos con numeracion gradiente |
| BlogPreview | `BlogPreview.astro` | Preview de 3 articulos del blog con categorias |
| Testimonials | `Testimonials.astro` | 3 testimonios de clientes con avatares de iniciales |
| CtaSection | `CtaSection.astro` | Llamada a la accion con gradiente naranja/ambar |
| ContactForm | `ContactForm.astro` | Formulario de contacto a 2 columnas con info de contacto |
| Cotizador | `Cotizador.astro` | Wizard de 4 pasos para cotizacion con calculo en tiempo real |
| CotizadorModal | `CotizadorModal.astro` | Modal wrapper para el cotizador con backdrop |
| WhatsAppWidget | `WhatsAppWidget.astro` | Boton flotante de WhatsApp (esquina inferior derecha) |
| Footer | `Footer.astro` | Footer de 3 columnas con CTA, contacto, redes y newsletter |

---

## 4. API ENDPOINTS (7)

### Endpoints Publicos

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/projects` | Obtener proyectos visibles con paginacion (params: page, categoria) |
| POST | `/api/quote` | Enviar cotizacion (valida campos, recalcula total, guarda en BD, envia emails) |

### Endpoints Admin (protegidos)

| Metodo | Ruta | Descripcion |
|---|---|---|
| POST | `/api/admin/login` | Autenticacion (body: password) |
| POST | `/api/admin/logout` | Cerrar sesion |
| POST | `/api/admin/projects` | Crear proyecto con imagen (FormData) |
| PATCH | `/api/admin/projects/[id]` | Actualizar proyecto |
| DELETE | `/api/admin/projects/[id]` | Eliminar proyecto e imagen |
| GET | `/api/admin/quotes/[id]` | Obtener detalle de cotizacion |
| PATCH | `/api/admin/quotes/[id]` | Actualizar estatus de cotizacion |

---

## 5. BASE DE DATOS (SQLite)

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

## 6. LIBRERIAS DEL SISTEMA (src/lib/)

| Archivo | Descripcion |
|---|---|
| `db.ts` | Capa de base de datos SQLite con funciones CRUD para quotes y projects |
| `pricing.ts` | Configuracion de precios y funcion calculateTotal() para cotizaciones |
| `auth.ts` | Autenticacion con cookies HMAC-SHA256 firmadas (24h expiry) |
| `email.ts` | Envio de emails via Resend API (notificacion admin + confirmacion cliente) |
| `upload.ts` | Manejo de subida de imagenes (JPEG/PNG/WebP, max 5MB) |

---

## 7. PRECIOS DEL COTIZADOR

### Tipos de Sitio
| Tipo | Precio |
|---|---|
| Landing | $5,600 MXN |
| Basico | $6,400 MXN |
| Profesional | $7,300 MXN |
| Empresarial | $8,900 MXN |

### Pagina Extra: $800 MXN

### Diseno
| Opcion | Precio |
|---|---|
| Plantilla personalizada | $0 |
| Desde cero | $2,500 |

### Funcionalidades
| Funcionalidad | Precio |
|---|---|
| Blog | $390 |
| Catalogo | $2,900 |
| Entregas | $3,800 |
| Tienda | $3,800 |
| Citas | $3,200 |
| Cotizador | $1,200 |
| CRM | $1,200 |

### Hosting
| Plan | Precio |
|---|---|
| 5 GB | $650 |
| 10 GB | $890 |
| 15 GB | $1,290 |

### Correo
| Plan | Precio |
|---|---|
| Sin correo | $0 |
| 2 cuentas | $220 |
| 6 cuentas | $320 |
| Ilimitado | $900 |

### Extras
| Extra | Precio |
|---|---|
| WhatsApp Widget | $500 |
| Chatbot | $4,200 |
| Localizador | $900 |
| Lector PDF | $350 |
| SEO avanzado | $1,200 |

---

## 8. PAQUETES WEB (Homepage)

| Plan | Precio | Entrega | Destacado |
|---|---|---|---|
| Landing Performance | $3,800 + IVA | 7 dias | Campanas y emprendedores |
| Web Corporativa | $6,400 + IVA | 15 dias | **MAS POPULAR** |
| Web SEO Performance | $8,900 + IVA | 20 dias | Crecer con Google |
| Headless Premium | $10,600 + IVA | 25 dias | CMS Blog + desarrollo a medida |

Renovacion anual: $1,840 / $2,450 / $3,140 / $3,860 + IVA respectivamente.

---

## 9. LAYOUTS (2)

| Layout | Archivo | Uso |
|---|---|---|
| Layout | `src/layouts/Layout.astro` | Paginas publicas. Meta tags, OG, ViewTransitions, scroll animations, CotizadorModal, WhatsApp |
| AdminLayout | `src/layouts/AdminLayout.astro` | Panel admin. Sin navbar/footer publico, header con logo y links admin, noindex |

---

## 10. VARIABLES DE ENTORNO

```
# Autenticacion
ADMIN_PASSWORD=tu_contrasena_segura
COOKIE_SECRET=tu_clave_secreta

# Base de datos
DB_PATH=/app/data/cotizador.db

# Email
RESEND_API_KEY=re_xxxxx

# Subida de archivos
UPLOAD_DIR=/app/uploads/projects

# Servidor
HOST=0.0.0.0
PORT=4000

# Opcional
SITE_URL=https://portafolioz.com
```

---

## 11. DEPLOY Y INFRAESTRUCTURA

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

## 12. DEPENDENCIAS

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
| @types/better-sqlite3 | - | Tipos TypeScript |

---

## 13. ESTADISTICAS DEL PROYECTO

| Metrica | Cantidad |
|---|---|
| Paginas publicas | 17 |
| Paginas admin | 6 |
| Componentes | 18 |
| Layouts | 2 |
| Endpoints API | 7 |
| Archivos lib | 5 |
| Tablas BD | 3 |
| **Total archivos fuente** | **55+** |
