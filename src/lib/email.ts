/**
 * email.ts - Envio de emails con Resend + templates HTML
 */
import { Resend } from 'resend';

function getResend(): Resend | null {
  const key = import.meta.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

type EmailQuote = {
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  total: number;
  items: { categoria: string; nombre: string; precio: number }[];
};

function formatMXN(n: number): string {
  return '$' + n.toLocaleString('es-MX');
}

function buildItemsTable(items: EmailQuote['items']): string {
  return items.map(i => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#374151;">${i.nombre}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;color:#374151;">${formatMXN(i.precio)}</td>
    </tr>
  `).join('');
}

function adminEmailHtml(q: EmailQuote): string {
  return `
  <div style="font-family:'Poppins',Arial,sans-serif;max-width:600px;margin:0 auto;">
    <div style="background:linear-gradient(135deg,#6366f1,#a855f7,#ec4899);padding:32px;border-radius:12px 12px 0 0;">
      <h1 style="color:#fff;margin:0;font-size:24px;">Nueva Cotizacion</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;">Portafolio Z</p>
    </div>
    <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;">
      <h2 style="font-size:18px;color:#111827;margin:0 0 16px;">Datos del cliente</h2>
      <table style="width:100%;margin-bottom:24px;">
        <tr><td style="color:#6b7280;padding:4px 0;">Nombre:</td><td style="color:#111827;">${q.nombre}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0;">Email:</td><td style="color:#111827;">${q.email}</td></tr>
        ${q.telefono ? `<tr><td style="color:#6b7280;padding:4px 0;">Telefono:</td><td style="color:#111827;">${q.telefono}</td></tr>` : ''}
        ${q.empresa ? `<tr><td style="color:#6b7280;padding:4px 0;">Empresa:</td><td style="color:#111827;">${q.empresa}</td></tr>` : ''}
      </table>
      <h2 style="font-size:18px;color:#111827;margin:0 0 16px;">Detalle de la cotizacion</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <thead>
          <tr style="background:#f9fafb;">
            <th style="padding:8px 12px;text-align:left;color:#6b7280;font-weight:600;">Concepto</th>
            <th style="padding:8px 12px;text-align:right;color:#6b7280;font-weight:600;">Precio</th>
          </tr>
        </thead>
        <tbody>${buildItemsTable(q.items)}</tbody>
      </table>
      <div style="background:linear-gradient(135deg,#6366f1,#a855f7);padding:16px;border-radius:8px;text-align:center;">
        <span style="color:rgba(255,255,255,0.8);font-size:14px;">Total estimado</span>
        <div style="color:#fff;font-size:28px;font-weight:700;">${formatMXN(q.total)} MXN</div>
      </div>
    </div>
    <div style="background:#f9fafb;padding:16px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;text-align:center;">
      <a href="${import.meta.env.SITE_URL || 'http://localhost:4444'}/admin/cotizaciones" style="color:#6366f1;text-decoration:none;font-weight:600;">Ver en panel admin &rarr;</a>
    </div>
  </div>`;
}

function clientEmailHtml(q: EmailQuote): string {
  return `
  <div style="font-family:'Poppins',Arial,sans-serif;max-width:600px;margin:0 auto;">
    <div style="background:linear-gradient(135deg,#6366f1,#a855f7,#ec4899);padding:32px;border-radius:12px 12px 0 0;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:24px;">Tu Cotizacion</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;">Portafolio Z - Diseno Web Profesional</p>
    </div>
    <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;">
      <p style="color:#374151;line-height:1.6;">Hola <strong>${q.nombre}</strong>,</p>
      <p style="color:#374151;line-height:1.6;">Gracias por tu interes en nuestros servicios. Aqui esta el resumen de tu cotizacion:</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <thead>
          <tr style="background:#f9fafb;">
            <th style="padding:8px 12px;text-align:left;color:#6b7280;font-weight:600;">Concepto</th>
            <th style="padding:8px 12px;text-align:right;color:#6b7280;font-weight:600;">Precio</th>
          </tr>
        </thead>
        <tbody>${buildItemsTable(q.items)}</tbody>
      </table>
      <div style="background:linear-gradient(135deg,#6366f1,#a855f7);padding:16px;border-radius:8px;text-align:center;margin:16px 0;">
        <span style="color:rgba(255,255,255,0.8);font-size:14px;">Total estimado</span>
        <div style="color:#fff;font-size:28px;font-weight:700;">${formatMXN(q.total)} MXN</div>
      </div>
      <p style="color:#6b7280;font-size:14px;line-height:1.6;">*Este es un estimado. El precio final puede variar segun los detalles especificos de tu proyecto. Un asesor se pondra en contacto contigo pronto.</p>
      <div style="text-align:center;margin:24px 0;">
        <a href="https://wa.me/525512345678?text=${encodeURIComponent(`Hola, acabo de hacer una cotizacion por ${formatMXN(q.total)} en su sitio web.`)}" style="display:inline-block;background:#25D366;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Contactar por WhatsApp</a>
      </div>
    </div>
    <div style="background:#f9fafb;padding:16px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;text-align:center;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">Portafolio Z &bull; portafolioz.com</p>
    </div>
  </div>`;
}

export async function sendQuoteEmails(quote: EmailQuote): Promise<{ success: boolean; error?: string }> {
  const resend = getResend();
  if (!resend) {
    console.log('[email] Resend no configurado. Cotizacion guardada sin enviar emails.');
    console.log('[email] Quote:', JSON.stringify(quote, null, 2));
    return { success: true };
  }

  try {
    // Email al admin
    await resend.emails.send({
      from: 'Cotizador PZ <cotizador@portafolioz.com>',
      to: ['hola@portafolioz.com'],
      subject: `Nueva cotizacion: ${quote.nombre} - ${formatMXN(quote.total)} MXN`,
      html: adminEmailHtml(quote),
    });

    // Email al cliente
    await resend.emails.send({
      from: 'Portafolio Z <noreply@portafolioz.com>',
      to: [quote.email],
      subject: `Tu cotizacion de Portafolio Z - ${formatMXN(quote.total)} MXN`,
      html: clientEmailHtml(quote),
    });

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    console.error('[email] Error enviando emails:', message);
    return { success: false, error: message };
  }
}
