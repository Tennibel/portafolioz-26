export const prerender = false;

import type { APIRoute } from 'astro';
import { clearSessionCookie } from '../../../lib/auth';

export const POST: APIRoute = async () => {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  const secure = import.meta.env.PROD ? '; Secure' : '';
  // Clear cookie on both paths (old `/admin` and new `/`)
  headers.append('Set-Cookie', clearSessionCookie());
  headers.append('Set-Cookie', `pz_admin_session=; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=0${secure}`);
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
};
