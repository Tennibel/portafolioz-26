/**
 * active-campaign.ts - Integracion con Active Campaign API v3
 * Crea/actualiza contactos y registra deals (cotizaciones)
 */

function getConfig() {
  const apiUrl = import.meta.env.AC_API_URL || process.env.AC_API_URL || '';
  const apiKey = import.meta.env.AC_API_KEY || process.env.AC_API_KEY || '';
  return { apiUrl, apiKey };
}

async function acFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const { apiUrl, apiKey } = getConfig();
  if (!apiUrl || !apiKey) {
    console.log('[AC] Active Campaign no configurado, saltando.');
    return null;
  }

  const url = `${apiUrl}/api/3/${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Api-Token': apiKey,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[AC] Error ${res.status} en ${endpoint}:`, text);
    return null;
  }

  return res.json();
}

/**
 * Crea o actualiza un contacto en Active Campaign.
 * Si el email ya existe, actualiza los datos.
 */
export async function syncContact(data: {
  email: string;
  nombre: string;
  telefono?: string;
  empresa?: string;
}): Promise<number | null> {
  const [firstName, ...lastParts] = data.nombre.trim().split(' ');
  const lastName = lastParts.join(' ') || '';

  const result = await acFetch('contact/sync', {
    method: 'POST',
    body: JSON.stringify({
      contact: {
        email: data.email,
        firstName: firstName,
        lastName: lastName,
        phone: data.telefono || '',
        orgname: data.empresa || '',
      },
    }),
  });

  if (!result?.contact?.id) return null;
  return parseInt(result.contact.id);
}

/**
 * Agrega un tag a un contacto. Crea el tag si no existe.
 */
export async function addTag(contactId: number, tagName: string): Promise<void> {
  // Buscar tag existente
  const search = await acFetch(`tags?search=${encodeURIComponent(tagName)}`);
  let tagId: number | null = null;

  if (search?.tags?.length > 0) {
    tagId = parseInt(search.tags[0].id);
  } else {
    // Crear tag
    const created = await acFetch('tags', {
      method: 'POST',
      body: JSON.stringify({
        tag: { tag: tagName, tagType: 'contact', description: '' },
      }),
    });
    tagId = created?.tag?.id ? parseInt(created.tag.id) : null;
  }

  if (!tagId) return;

  await acFetch('contactTags', {
    method: 'POST',
    body: JSON.stringify({
      contactTag: { contact: contactId, tag: tagId },
    }),
  });
}

/**
 * Crea una nota en un contacto (para guardar detalles de cotizacion).
 */
export async function addNote(contactId: number, note: string): Promise<void> {
  await acFetch('notes', {
    method: 'POST',
    body: JSON.stringify({
      note: {
        note: note,
        relid: contactId,
        reltype: 'Subscriber',
      },
    }),
  });
}

/**
 * Registra un contacto desde el formulario de contacto.
 * Tag: "Web - Contacto"
 */
export async function trackContactForm(data: {
  nombre: string;
  email: string;
  telefono?: string;
  proyecto?: string;
}): Promise<void> {
  try {
    const contactId = await syncContact({
      email: data.email,
      nombre: data.nombre,
      telefono: data.telefono,
    });
    if (!contactId) return;

    await addTag(contactId, 'Web - Contacto');

    if (data.proyecto) {
      await addNote(contactId, `Mensaje del formulario web:\n${data.proyecto}`);
    }
  } catch (err) {
    console.error('[AC] Error en trackContactForm:', err);
  }
}

/**
 * Registra un contacto desde el cotizador.
 * Tag: "Web - Cotizacion"
 * Nota: Desglose de la cotizacion
 */
export async function trackQuote(data: {
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  total: number;
  totalMensual?: number;
  items: { categoria: string; nombre: string; precio: number }[];
  itemsMensuales?: { categoria: string; nombre: string; precio: number }[];
}): Promise<void> {
  try {
    const contactId = await syncContact({
      email: data.email,
      nombre: data.nombre,
      telefono: data.telefono,
      empresa: data.empresa,
    });
    if (!contactId) return;

    await addTag(contactId, 'Web - Cotizacion');

    // Construir nota con desglose
    let note = `Cotizacion por $${data.total.toLocaleString('es-MX')} MXN\n\n`;
    note += `Desglose:\n`;
    for (const item of data.items) {
      note += `- ${item.categoria}: ${item.nombre} → $${item.precio.toLocaleString('es-MX')}\n`;
    }
    if (data.totalMensual && data.totalMensual > 0 && data.itemsMensuales) {
      note += `\nMensualidades:\n`;
      for (const item of data.itemsMensuales) {
        note += `- ${item.nombre} → $${item.precio.toLocaleString('es-MX')}/mes\n`;
      }
      note += `\nTotal mensual: $${data.totalMensual.toLocaleString('es-MX')}/mes`;
    }

    await addNote(contactId, note);
  } catch (err) {
    console.error('[AC] Error en trackQuote:', err);
  }
}
