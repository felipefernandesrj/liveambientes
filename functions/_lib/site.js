// Utilidades das páginas dinâmicas (SSR em Pages Functions): API do backoffice, escape, layout com header/footer do site.
// Env: BACKOFFICE_API (padrão https://admin.liveambientes.com.br), BACKOFFICE_TEST=1 (só local: inclui dados de teste),
//      TURNSTILE_SITE_KEY (formulário "Pedir orçamento"; sem ela o site mostra só o WhatsApp).

export const SITE = 'https://www.liveambientes.com.br';
export const apiBase = (env) => (env.BACKOFFICE_API || 'https://admin.liveambientes.com.br').replace(/\/$/, '');

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
export const attr = esc;

/** GET na API pública; null em 404. Cache de borda curto (o backoffice já usa KV). */
export async function api(env, path) {
  const sep = path.includes('?') ? '&' : '?';
  const url = `${apiBase(env)}${path}${env.BACKOFFICE_TEST === '1' ? `${sep}test=1` : ''}`;
  const r = await fetch(url, { headers: { accept: 'application/json' }, cf: { cacheTtl: 60, cacheEverything: true } });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`api ${r.status}`);
  return r.json();
}

export const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: 'long', year: 'numeric' }) : '');
export const fmtSpeed = (m) => (m == null ? null : m < 60 ? `${Math.max(1, Math.round(m))} min` : m < 48 * 60 ? `${Math.round(m / 60)} h` : `${Math.round(m / 1440)} dias`);
export const STATUS = { online: 'Online agora', away: 'Ausente', offline: 'Offline' };

const HEADER = `<header class="site-header" id="siteHeader">
  <div class="container">
    <a href="/" class="logo" aria-label="Live Ambientes, página inicial">LIVE</a>
    <nav class="nav-links" id="navLinks" aria-label="Principal">
      <a href="/#ambientes">Ambientes</a>
      <a href="/projetistas">Projetistas</a>
      <a href="/blog">Blog</a>
      <a href="/#lojas">Lojas</a>
      <a href="/#contato">Contato</a>
    </nav>
    <div class="nav-cta">
      <a href="/#orcamento" class="btn btn-outline">Orçamento Rápido</a>
      <button class="nav-toggle" id="navToggle" aria-label="Abrir menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>`;

const FOOTER = `<footer class="site-footer">
  <div class="container">
    <div class="footer-top">
      <div><a href="/" class="logo" style="color:var(--c-0);">LIVE</a><p>Móveis planejados de alto padrão. A sua vida sob medida.</p></div>
      <div class="footer-col"><h5>Navegação</h5><a href="/#ambientes">Ambientes</a><a href="/projetistas">Projetistas</a><a href="/blog">Blog</a><a href="/#contato">Contato</a></div>
      <div class="footer-col"><h5>Lojas</h5><a href="/#lojas">Recreio</a><a href="/#lojas">Tijuca</a><a href="/#lojas">Niterói</a></div>
    </div>
    <div class="footer-inner"><span>&copy; 2026 Live Ambientes | Todos os direitos reservados. · <a href="/politica-de-privacidade.html" style="text-decoration:underline;">Política de Privacidade</a></span></div>
  </div>
</footer>`;

/**
 * Página completa. `head`: { title, description, path, image?, type?, jsonld?: object|object[], noindex? }.
 * `preload`: URL da imagem do topo (LCP).
 */
export function page({ title, description, path, image, type = 'website', jsonld, noindex, preload }, body, { scripts = '', status = 200 } = {}) {
  const url = SITE + path;
  const ld = (Array.isArray(jsonld) ? jsonld : jsonld ? [jsonld] : []).map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`).join('\n');
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)} | Live Ambientes</title>
<meta name="description" content="${attr(description)}">
<link rel="canonical" href="${attr(url)}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<meta property="og:site_name" content="Live Ambientes">
<meta property="og:locale" content="pt_BR">
<meta property="og:type" content="${attr(type)}">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(description)}">
<meta property="og:url" content="${attr(url)}">
${image ? `<meta property="og:image" content="${attr(image)}"><meta name="twitter:card" content="summary_large_image">` : '<meta name="twitter:card" content="summary">'}
${preload ? `<link rel="preload" as="image" href="${attr(preload)}" fetchpriority="high">` : ''}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@200;300;400;500&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="stylesheet" href="/css/style.css?v=20">
<link rel="stylesheet" href="/css/dinamico.css?v=1">
${ld}
</head>
<body class="dyn">
<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
${HEADER}
<main id="conteudo">
${body}
</main>
${FOOTER}
<script src="/js/main.js?v=7"></script>
${scripts}
</body>
</html>`;
  return new Response(html, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': status === 200 ? 'public, max-age=60, s-maxage=300' : 'no-store' } });
}

/** Faixa escura do topo (mesma linguagem do .ambiente-hero do site). */
export const hero = ({ eyebrow, title, text, image, alt, compact }) => `<section class="ambiente-hero${compact ? ' dyn-hero-compact' : ''}">
  ${image ? `<img src="${attr(image)}" alt="${attr(alt ?? '')}" fetchpriority="high" decoding="async" width="1600" height="900">` : ''}
  <div class="container">
    ${eyebrow ? `<span class="eyebrow on-dark">${esc(eyebrow)}</span>` : ''}
    <h1>${esc(title)}</h1>
    ${text ? `<p>${esc(text)}</p>` : ''}
  </div>
</section>`;

export const notFound = (what = 'Página') => page({ title: `${what} não encontrado(a)`, description: 'Conteúdo não encontrado.', path: '/404', noindex: true },
  `${hero({ eyebrow: 'Erro 404', title: `${what} não encontrado(a)`, compact: true })}<section class="section section-light"><div class="container ambiente-cta"><p>O endereço pode ter mudado.</p><a class="btn btn-primary" href="/">Voltar ao início</a></div></section>`, { status: 404 });

export const errorPage = () => new Response('<!doctype html><meta charset="utf-8"><title>Live Ambientes</title><p style="font-family:sans-serif;padding:40px">Não foi possível carregar agora. Tente de novo em instantes. <a href="/">Início</a></p>', { status: 503, headers: { 'content-type': 'text/html; charset=utf-8', 'retry-after': '30' } });

/** Imagem com lazy loading e proporção reservada (sem salto de layout). */
export const img = (src, alt, { w = 800, h = 600, eager = false, cls = '' } = {}) =>
  src ? `<img src="${attr(src)}" alt="${attr(alt)}" width="${w}" height="${h}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"${cls ? ` class="${cls}"` : ''}>` : '';

export const statusBadge = (status) => (status ? `<span class="dyn-status dyn-status-${attr(status)}"><span class="dot" aria-hidden="true"></span>${esc(STATUS[status] ?? status)}</span>` : '');
