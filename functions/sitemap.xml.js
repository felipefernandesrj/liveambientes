// /sitemap.xml: páginas fixas + blog + projetistas + projetos (dados públicos do backoffice).
import { api, SITE } from './_lib/site.js';

const STATIC = ['/', '/projetistas', '/blog', '/politica-de-privacidade.html', '/projetos/marina-paiva.html'];
const x = (s) => String(s).replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`);

export async function onRequestGet({ env }) {
  const urls = STATIC.map((p) => ({ loc: SITE + p }));
  try {
    const [blog, pros] = await Promise.all([api(env, '/api/public/blog/posts?per=50&page=1'), api(env, '/api/public/projetistas')]);
    for (const p of blog?.posts ?? []) urls.push({ loc: `${SITE}/blog/${p.slug}`, lastmod: p.updated_at || p.published_at });
    const details = await Promise.all((pros?.projetistas ?? []).slice(0, 100).map((p) => api(env, `/api/public/projetistas/${p.slug}`).catch(() => null)));
    for (const d of details.filter(Boolean)) {
      urls.push({ loc: `${SITE}/projetistas/${d.slug}` });
      for (const pj of d.projects) urls.push({ loc: `${SITE}/projetos/${pj.slug}` });
    }
  } catch (e) { console.log('sitemap: API indisponível, só páginas fixas', e && e.message); }
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Map(urls.map((u) => [u.loc, u])).values()]
    .map((u) => `  <url><loc>${x(u.loc)}</loc>${u.lastmod ? `<lastmod>${x(u.lastmod.slice(0, 10))}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
}
