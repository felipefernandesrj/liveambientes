var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../.wrangler/tmp/pages-SNhcK6/functionsWorker-0.4304307368708403.mjs
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var SITE = "https://www.liveambientes.com.br";
var apiBase = /* @__PURE__ */ __name2((env) => (env.BACKOFFICE_API || "https://admin.liveambientes.com.br").replace(/\/$/, ""), "apiBase");
var esc = /* @__PURE__ */ __name2((s) => String(s ?? "").replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`), "esc");
var attr = esc;
async function api(env, path) {
  const sep = path.includes("?") ? "&" : "?";
  const url = `${apiBase(env)}${path}${env.BACKOFFICE_TEST === "1" ? `${sep}test=1` : ""}`;
  const r = await fetch(url, { headers: { accept: "application/json" }, cf: { cacheTtl: 60, cacheEverything: true } });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`api ${r.status}`);
  return r.json();
}
__name(api, "api");
__name2(api, "api");
var fmtDate = /* @__PURE__ */ __name2((iso) => iso ? new Date(iso).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "long", year: "numeric" }) : "", "fmtDate");
var fmtSpeed = /* @__PURE__ */ __name2((m) => m == null ? null : m < 60 ? `${Math.max(1, Math.round(m))} min` : m < 48 * 60 ? `${Math.round(m / 60)} h` : `${Math.round(m / 1440)} dias`, "fmtSpeed");
var STATUS = { online: "Online agora", away: "Ausente", offline: "Offline" };
var HEADER = `<header class="site-header" id="siteHeader">
  <div class="container">
    <a href="/" class="logo" aria-label="Live Ambientes, p\xE1gina inicial">LIVE</a>
    <nav class="nav-links" id="navLinks" aria-label="Principal">
      <a href="/#ambientes">Ambientes</a>
      <a href="/projetistas">Projetistas</a>
      <a href="/blog">Blog</a>
      <a href="/#lojas">Lojas</a>
      <a href="/#contato">Contato</a>
    </nav>
    <div class="nav-cta">
      <a href="/#orcamento" class="btn btn-outline">Or\xE7amento R\xE1pido</a>
      <button class="nav-toggle" id="navToggle" aria-label="Abrir menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>`;
var FOOTER = `<footer class="site-footer">
  <div class="container">
    <div class="footer-top">
      <div><a href="/" class="logo" style="color:var(--c-0);">LIVE</a><p>M\xF3veis planejados de alto padr\xE3o. A sua vida sob medida.</p></div>
      <div class="footer-col"><h5>Navega\xE7\xE3o</h5><a href="/#ambientes">Ambientes</a><a href="/projetistas">Projetistas</a><a href="/blog">Blog</a><a href="/#contato">Contato</a></div>
      <div class="footer-col"><h5>Lojas</h5><a href="/#lojas">Recreio</a><a href="/#lojas">Tijuca</a><a href="/#lojas">Niter\xF3i</a></div>
    </div>
    <div class="footer-inner"><span>&copy; 2026 Live Ambientes | Todos os direitos reservados. \xB7 <a href="/politica-de-privacidade.html" style="text-decoration:underline;">Pol\xEDtica de Privacidade</a></span></div>
  </div>
</footer>`;
function page({ title, description, path, image, type = "website", jsonld, noindex, preload }, body, { scripts = "", status = 200 } = {}) {
  const url = SITE + path;
  const ld = (Array.isArray(jsonld) ? jsonld : jsonld ? [jsonld] : []).map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, "\\u003c")}<\/script>`).join("\n");
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)} | Live Ambientes</title>
<meta name="description" content="${attr(description)}">
<link rel="canonical" href="${attr(url)}">
${noindex ? '<meta name="robots" content="noindex">' : ""}
<meta property="og:site_name" content="Live Ambientes">
<meta property="og:locale" content="pt_BR">
<meta property="og:type" content="${attr(type)}">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(description)}">
<meta property="og:url" content="${attr(url)}">
${image ? `<meta property="og:image" content="${attr(image)}"><meta name="twitter:card" content="summary_large_image">` : '<meta name="twitter:card" content="summary">'}
${preload ? `<link rel="preload" as="image" href="${attr(preload)}" fetchpriority="high">` : ""}
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
<a class="skip-link" href="#conteudo">Pular para o conte\xFAdo</a>
${HEADER}
<main id="conteudo">
${body}
</main>
${FOOTER}
<script src="/js/main.js?v=7"><\/script>
${scripts}
</body>
</html>`;
  return new Response(html, { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": status === 200 ? "public, max-age=60, s-maxage=300" : "no-store" } });
}
__name(page, "page");
__name2(page, "page");
var hero = /* @__PURE__ */ __name2(({ eyebrow, title, text, image, alt, compact }) => `<section class="ambiente-hero${compact ? " dyn-hero-compact" : ""}">
  ${image ? `<img src="${attr(image)}" alt="${attr(alt ?? "")}" fetchpriority="high" decoding="async" width="1600" height="900">` : ""}
  <div class="container">
    ${eyebrow ? `<span class="eyebrow on-dark">${esc(eyebrow)}</span>` : ""}
    <h1>${esc(title)}</h1>
    ${text ? `<p>${esc(text)}</p>` : ""}
  </div>
</section>`, "hero");
var notFound = /* @__PURE__ */ __name2((what = "P\xE1gina") => page(
  { title: `${what} n\xE3o encontrado(a)`, description: "Conte\xFAdo n\xE3o encontrado.", path: "/404", noindex: true },
  `${hero({ eyebrow: "Erro 404", title: `${what} n\xE3o encontrado(a)`, compact: true })}<section class="section section-light"><div class="container ambiente-cta"><p>O endere\xE7o pode ter mudado.</p><a class="btn btn-primary" href="/">Voltar ao in\xEDcio</a></div></section>`,
  { status: 404 }
), "notFound");
var errorPage = /* @__PURE__ */ __name2(() => new Response('<!doctype html><meta charset="utf-8"><title>Live Ambientes</title><p style="font-family:sans-serif;padding:40px">N\xE3o foi poss\xEDvel carregar agora. Tente de novo em instantes. <a href="/">In\xEDcio</a></p>', { status: 503, headers: { "content-type": "text/html; charset=utf-8", "retry-after": "30" } }), "errorPage");
var img = /* @__PURE__ */ __name2((src, alt, { w = 800, h = 600, eager = false, cls = "" } = {}) => src ? `<img src="${attr(src)}" alt="${attr(alt)}" width="${w}" height="${h}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"${cls ? ` class="${cls}"` : ""}>` : "", "img");
var statusBadge = /* @__PURE__ */ __name2((status) => status ? `<span class="dyn-status dyn-status-${attr(status)}"><span class="dot" aria-hidden="true"></span>${esc(STATUS[status] ?? status)}</span>` : "", "statusBadge");
var card = /* @__PURE__ */ __name2((p) => `<article class="dyn-card">
  <a href="/blog/${attr(p.slug)}" class="dyn-card-link">
    <div class="dyn-card-media">${img(p.cover_url, "", { w: 800, h: 500 })}</div>
    <div class="dyn-card-body">
      <span class="eyebrow">${esc(fmtDate(p.published_at))}${p.author ? ` \xB7 ${esc(p.author.name)}` : ""}</span>
      <h2 class="dyn-card-title">${esc(p.title)}</h2>
      ${p.excerpt ? `<p>${esc(p.excerpt)}</p>` : ""}
    </div>
  </a>
</article>`, "card");
var pager = /* @__PURE__ */ __name2((base, pg, total, per) => {
  const pages = Math.ceil(total / per);
  if (pages <= 1) return "";
  const link = /* @__PURE__ */ __name2((n, label, rel) => `<a class="btn btn-ghost" href="${base}${base.includes("?") ? "&" : "?"}pagina=${n}"${rel ? ` rel="${rel}"` : ""}>${label}</a>`, "link");
  return `<nav class="dyn-pager" aria-label="Pagina\xE7\xE3o">${pg > 1 ? link(pg - 1, "\u2190 Anteriores", "prev") : "<span></span>"}<span>P\xE1gina ${pg} de ${pages}</span>${pg < pages ? link(pg + 1, "Pr\xF3ximos \u2192", "next") : "<span></span>"}</nav>`;
}, "pager");
async function onRequestGet({ request, env, params }) {
  const parts = (params.path || []).filter(Boolean);
  const url = new URL(request.url);
  const pg = Math.max(1, Number(url.searchParams.get("pagina")) || 1);
  const tag = /^[\p{L}\d -]{1,40}$/u.test(url.searchParams.get("tag") ?? "") ? url.searchParams.get("tag") : null;
  try {
    if (!parts.length) {
      const d = await api(env, `/api/public/blog/posts?per=12&page=${pg}${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`);
      const posts = d?.posts ?? [];
      return page(
        {
          title: tag ? `Blog: ${tag}` : "Blog",
          description: "Ideias, projetos e dicas de m\xF3veis planejados da Live Ambientes.",
          path: `/blog${tag ? `?tag=${encodeURIComponent(tag)}` : ""}`,
          jsonld: { "@context": "https://schema.org", "@type": "Blog", name: "Blog Live Ambientes", url: `${SITE}/blog` }
        },
        `${hero({ eyebrow: "Blog", title: tag ? `Tema: ${tag}` : "Ideias para o seu projeto", text: "Planejamento, materiais e projetos reais da Live Ambientes.", compact: true })}
<section class="section section-light"><div class="container">
  ${posts.length ? `<div class="dyn-grid">${posts.map(card).join("")}</div>` : '<p class="dyn-empty">Nenhum artigo publicado ainda.</p>'}
  ${pager(`/blog${tag ? `?tag=${encodeURIComponent(tag)}` : ""}`, pg, d?.total ?? 0, 12)}
</div></section>`
      );
    }
    if (parts[0] === "autor" && parts[1] && parts.length === 2) {
      const [pro, d] = await Promise.all([api(env, `/api/public/projetistas/${encodeURIComponent(parts[1])}`), api(env, `/api/public/blog/posts?per=12&page=${pg}&author=${encodeURIComponent(parts[1])}`)]);
      if (!pro) return notFound("Autor");
      return page(
        {
          title: `Artigos de ${pro.name}`,
          description: `Artigos de ${pro.name}, projetista da Live Ambientes ${pro.store?.name ?? ""}.`,
          path: `/blog/autor/${parts[1]}`,
          image: pro.avatar_url,
          jsonld: { "@context": "https://schema.org", "@type": "Person", name: pro.name, url: `${SITE}/projetistas/${pro.slug}`, image: pro.avatar_url ?? void 0 }
        },
        `${hero({ eyebrow: "Blog \xB7 Autor", title: pro.name, text: pro.headline, compact: true })}
<section class="section section-light"><div class="container">
  <p class="dyn-lead"><a class="btn btn-outline-dark" href="/projetistas/${attr(pro.slug)}">Ver perfil e projetos</a></p>
  ${d?.posts?.length ? `<div class="dyn-grid">${d.posts.map(card).join("")}</div>` : '<p class="dyn-empty">Nenhum artigo publicado ainda.</p>'}
  ${pager(`/blog/autor/${parts[1]}`, pg, d?.total ?? 0, 12)}
</div></section>`
      );
    }
    if (parts.length !== 1 || !/^[a-z0-9-]{1,80}$/.test(parts[0])) return notFound("Artigo");
    const p = await api(env, `/api/public/blog/posts/${parts[0]}`);
    if (!p) return notFound("Artigo");
    const author = p.author?.slug ? `<a href="/blog/autor/${attr(p.author.slug)}">${esc(p.author.name)}</a>` : esc(p.author?.name ?? "Live Ambientes");
    return page(
      {
        title: p.seo?.title || p.title,
        description: p.seo?.description || p.excerpt || "",
        path: `/blog/${p.slug}`,
        image: p.cover_url,
        type: "article",
        preload: p.cover_url,
        jsonld: {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: p.title,
          description: p.seo?.description || p.excerpt || void 0,
          image: p.cover_url || void 0,
          datePublished: p.published_at,
          dateModified: p.updated_at,
          mainEntityOfPage: `${SITE}/blog/${p.slug}`,
          keywords: (p.tags || []).join(", ") || void 0,
          author: p.author ? { "@type": "Person", name: p.author.name, url: p.author.slug ? `${SITE}/projetistas/${p.author.slug}` : void 0 } : { "@type": "Organization", name: "Live Ambientes" },
          publisher: { "@type": "Organization", name: "Live Ambientes", url: SITE }
        }
      },
      `${hero({ eyebrow: fmtDate(p.published_at), title: p.title, text: p.excerpt, image: p.cover_url, alt: "" })}
<section class="section section-light"><div class="container dyn-article">
  <p class="dyn-byline">Por ${author}${(p.tags || []).length ? ` \xB7 ${p.tags.map((t) => `<a class="dyn-tag" href="/blog?tag=${encodeURIComponent(t)}">${esc(t)}</a>`).join(" ")}` : ""}</p>
  <div class="dyn-prose">${p.body_html}</div>
  <div class="ambiente-cta" style="margin-top:3rem"><h2>Quer um projeto como este?</h2><a href="/#orcamento" class="btn btn-primary">Solicitar Or\xE7amento</a></div>
</div></section>`
    );
  } catch (e) {
    console.log("blog: falha", e && e.message);
    return errorPage();
  }
}
__name(onRequestGet, "onRequestGet");
__name2(onRequestGet, "onRequestGet");
function ctaBlock(env, pro, itemSlug) {
  const key = env.TURNSTILE_SITE_KEY;
  const first = (pro.name || "").split(" ")[0];
  const wa = pro.whatsapp_url ? `<a class="btn btn-outline-dark" href="${attr(pro.whatsapp_url)}" target="_blank" rel="noopener" data-wa data-pro="${attr(pro.slug)}"${itemSlug ? ` data-item="${attr(itemSlug)}"` : ""}>Conversar no WhatsApp</a>` : "";
  const form = key ? `<form class="dyn-form" id="pedido" data-pro="${attr(pro.slug)}"${itemSlug ? ` data-item="${attr(itemSlug)}"` : ""} novalidate>
    <div class="dyn-form-grid">
      <div class="dyn-field"><label for="f-name">Nome *</label><input id="f-name" name="name" autocomplete="name" required maxlength="120"></div>
      <div class="dyn-field"><label for="f-phone">WhatsApp ou telefone *</label><input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required maxlength="30"></div>
      <div class="dyn-field dyn-span2"><label for="f-email">E-mail</label><input id="f-email" name="email" type="email" autocomplete="email" maxlength="200"></div>
      <div class="dyn-field dyn-span2"><label for="f-msg">Conte sobre o seu projeto</label><textarea id="f-msg" name="message" rows="4" maxlength="2000"></textarea></div>
    </div>
    <div class="cf-turnstile" data-sitekey="${attr(key)}" data-language="pt-br"></div>
    <p class="dyn-note" id="f-status" role="status" aria-live="polite"></p>
    <button class="btn btn-primary" type="submit">Pedir or\xE7amento com ${esc(first)}</button>
    <p class="dyn-small">Seus dados v\xE3o s\xF3 para ${esc(first)} e a loja ${esc(pro.store?.name ?? "")}. <a href="/politica-de-privacidade.html">Privacidade</a>.</p>
  </form>` : "";
  return `<section class="section section-tint" id="orcamento-projetista" aria-labelledby="h-cta"><div class="container dyn-cta">
    <div><span class="eyebrow">Atendimento direto</span><h2 id="h-cta">Pedir or\xE7amento com ${esc(first)}</h2>
      <p>${esc(first)} recebe seu pedido na hora${pro.response_minutes != null ? ` e costuma responder em cerca de ${pro.response_minutes < 60 ? `${Math.max(1, pro.response_minutes)} min` : `${Math.round(pro.response_minutes / 60)} h`}` : ""}.</p>
      <div class="dyn-actions">${wa}</div></div>
    ${form}
  </div></section>`;
}
__name(ctaBlock, "ctaBlock");
__name2(ctaBlock, "ctaBlock");
var ctaScripts = /* @__PURE__ */ __name2((env) => `${env.TURNSTILE_SITE_KEY ? '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer><\/script>' : ""}
<script>window.LIVE_API=${JSON.stringify((env.BACKOFFICE_API || "https://admin.liveambientes.com.br").replace(/\/$/, ""))};<\/script>
<script src="/js/dinamico.js?v=1" defer><\/script>`, "ctaScripts");
var projCard = /* @__PURE__ */ __name2((p) => `<article class="dyn-card"><a class="dyn-card-link" href="/projetos/${attr(p.slug)}">
  <div class="dyn-card-media">${img(p.cover_url, p.title, { w: 800, h: 600 })}</div>
  <div class="dyn-card-body"><span class="eyebrow">${esc([p.ambiente, p.location, p.year].filter(Boolean).join(" \xB7 "))}</span><h3 class="dyn-card-title">${esc(p.title)}</h3></div></a></article>`, "projCard");
var stars = /* @__PURE__ */ __name2((n) => `<span class="dyn-stars" aria-label="nota ${n} de 5">${"\u2605".repeat(n)}${"\u2606".repeat(5 - n)}</span>`, "stars");
async function onRequestGet2({ env, params }) {
  const parts = (params.path || []).filter(Boolean);
  try {
    if (!parts.length) {
      const d = await api(env, "/api/public/projetistas");
      const list = d?.projetistas ?? [];
      return page(
        {
          title: "Projetistas",
          description: "Conhe\xE7a os projetistas da Live Ambientes e fale direto com quem vai desenhar o seu projeto.",
          path: "/projetistas",
          jsonld: { "@context": "https://schema.org", "@type": "ItemList", itemListElement: list.map((p2, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/projetistas/${p2.slug}`, name: p2.name })) }
        },
        `${hero({ eyebrow: "Equipe", title: "Nossos projetistas", text: "Escolha quem vai desenhar o seu projeto e fale direto com essa pessoa.", compact: true })}
<section class="section section-light"><div class="container">
  ${list.length ? `<ul class="dyn-people">${list.map((p2) => `<li><a class="dyn-person" href="/projetistas/${attr(p2.slug)}">
    <span class="dyn-avatar">${p2.avatar_url ? img(p2.avatar_url, "", { w: 160, h: 160 }) : `<span aria-hidden="true">${esc(p2.name.slice(0, 1))}</span>`}</span>
    <span class="dyn-person-body"><strong>${esc(p2.name)}</strong><span>${esc(p2.headline ?? "")}</span>
      <span class="dyn-meta">${esc(p2.store?.name ?? "")}${fmtSpeed(p2.response_minutes) ? ` \xB7 responde em ~${esc(fmtSpeed(p2.response_minutes))}` : ""}</span>
      ${(p2.specialties || []).length ? `<span class="dyn-chips">${p2.specialties.slice(0, 3).map((s) => `<span class="dyn-chip">${esc(s)}</span>`).join("")}</span>` : ""}</span></a></li>`).join("")}</ul>` : '<p class="dyn-empty">Em breve, os perfis dos nossos projetistas.</p>'}
</div></section>`
      );
    }
    if (parts.length !== 1 || !/^[a-z0-9-]{2,80}$/.test(parts[0])) return notFound("Projetista");
    const p = await api(env, `/api/public/projetistas/${parts[0]}`);
    if (!p) return notFound("Projetista");
    const speed = fmtSpeed(p.response_minutes);
    const loose = p.projects.filter((x2) => !p.folders.some((f) => f.projects.some((y) => y.slug === x2.slug)));
    const sections = [...p.folders.filter((f) => f.projects.length), ...loose.length ? [{ title: p.folders.length ? "Outros projetos" : "Projetos", slug: "projetos", projects: loose }] : []];
    return page(
      {
        title: `${p.name}, projetista`,
        description: p.headline || `Projetos de ${p.name} na Live Ambientes ${p.store?.name ?? ""}.`,
        path: `/projetistas/${p.slug}`,
        image: p.cover_url || p.avatar_url,
        type: "profile",
        preload: p.cover_url,
        jsonld: {
          "@context": "https://schema.org",
          "@type": "Person",
          name: p.name,
          jobTitle: "Projetista de m\xF3veis planejados",
          description: p.headline || void 0,
          image: p.avatar_url || void 0,
          url: `${SITE}/projetistas/${p.slug}`,
          worksFor: { "@type": "Organization", name: `Live Ambientes ${p.store?.name ?? ""}`.trim(), url: SITE },
          sameAs: [p.instagram && `https://instagram.com/${p.instagram}`, p.pinterest && `https://pinterest.com/${p.pinterest}`].filter(Boolean),
          ...p.rating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating.average, reviewCount: p.rating.count } } : {}
        }
      },
      `${hero({ eyebrow: `Projetista \xB7 ${p.store?.name ?? ""}`, title: p.name, text: p.headline, image: p.cover_url, alt: "" })}
<section class="section section-light"><div class="container dyn-profile">
  <div class="dyn-profile-card">
    <span class="dyn-avatar dyn-avatar-lg">${p.avatar_url ? img(p.avatar_url, `Foto de ${p.name}`, { w: 240, h: 240, eager: true }) : `<span aria-hidden="true">${esc(p.name.slice(0, 1))}</span>`}</span>
    ${statusBadge(p.status)}
    <dl class="dyn-facts">
      ${speed ? `<div><dt>Tempo de resposta</dt><dd>~${esc(speed)}</dd></div>` : ""}
      ${p.rating ? `<div><dt>Avalia\xE7\xE3o</dt><dd>${esc(String(p.rating.average).replace(".", ","))} de 5 (${p.rating.count})</dd></div>` : ""}
      <div><dt>Loja</dt><dd>${esc(p.store?.name ?? "")}</dd></div>
    </dl>
    <div class="dyn-actions"><a class="btn btn-primary" href="#orcamento-projetista">Pedir or\xE7amento</a></div>
    <p class="dyn-social">${p.instagram ? `<a href="https://instagram.com/${attr(p.instagram)}" target="_blank" rel="noopener">Instagram</a>` : ""}${p.pinterest ? `<a href="https://pinterest.com/${attr(p.pinterest)}" target="_blank" rel="noopener">Pinterest</a>` : ""}</p>
  </div>
  <div class="dyn-profile-main">
    ${p.bio ? `<div class="dyn-prose"><p>${esc(p.bio).replace(/\n+/g, "</p><p>")}</p></div>` : ""}
    ${(p.specialties || []).length ? `<p class="dyn-chips">${p.specialties.map((s) => `<span class="dyn-chip">${esc(s)}</span>`).join("")}</p>` : ""}
  </div>
</div></section>
${sections.map((f) => `<section class="section section-light dyn-tight" aria-labelledby="h-${attr(f.slug)}"><div class="container">
  <div class="section-head"><h2 id="h-${attr(f.slug)}">${esc(f.title)}</h2>${f.description ? `<p>${esc(f.description)}</p>` : ""}</div>
  <div class="dyn-grid">${f.projects.map(projCard).join("")}</div></div></section>`).join("")}
${p.reviews.length ? `<section class="section section-tint" aria-labelledby="h-rev"><div class="container"><div class="section-head"><h2 id="h-rev">O que dizem os clientes</h2></div>
  <div class="dyn-reviews">${p.reviews.map((r) => `<figure class="dyn-review">${stars(r.rating)}<blockquote>${esc(r.body)}</blockquote><figcaption>${esc(r.client_name)}</figcaption></figure>`).join("")}</div></div></section>` : ""}
${p.articles.length ? `<section class="section section-light dyn-tight" aria-labelledby="h-art"><div class="container"><div class="section-head"><h2 id="h-art">Artigos de ${esc(p.name.split(" ")[0])}</h2></div>
  <div class="dyn-grid">${p.articles.map((a) => `<article class="dyn-card"><a class="dyn-card-link" href="/blog/${attr(a.slug)}"><div class="dyn-card-media">${img(a.cover_url, "", { w: 800, h: 500 })}</div><div class="dyn-card-body"><h3 class="dyn-card-title">${esc(a.title)}</h3>${a.excerpt ? `<p>${esc(a.excerpt)}</p>` : ""}</div></a></article>`).join("")}</div>
  <p><a class="btn btn-ghost" href="/blog/autor/${attr(p.slug)}">Todos os artigos</a></p></div></section>` : ""}
${ctaBlock(env, p)}`,
      { scripts: ctaScripts(env) }
    );
  } catch (e) {
    console.log("projetistas: falha", e && e.message);
    return errorPage();
  }
}
__name(onRequestGet2, "onRequestGet2");
__name2(onRequestGet2, "onRequestGet");
var block = /* @__PURE__ */ __name2((s, title) => {
  switch (s.type) {
    case "floor_plan":
      return /\.pdf$/i.test(s.url) ? `<p class="dyn-plan"><a class="btn btn-outline-dark" href="${attr(s.url)}" target="_blank" rel="noopener">Ver a planta (PDF)</a></p>` : `<figure class="dyn-figure dyn-plan">${img(s.url, `Planta do projeto ${title}`, { w: 1600, h: 1e3 })}<figcaption>Planta</figcaption></figure>`;
    case "text":
      return `<div class="dyn-prose">${s.html}</div>`;
    case "gallery":
      return `<div class="dyn-gallery">${s.images.map((x2, i) => `<a href="${attr(x2.url)}" target="_blank" rel="noopener">${img(x2.url, `${title}, foto ${i + 1}`, { w: 1200, h: 900 })}</a>`).join("")}</div>`;
    case "before_after":
      return `<div class="dyn-ba"><figure>${img(s.before_url, `${title}, antes`, { w: 1200, h: 900 })}<figcaption>Antes</figcaption></figure><figure>${img(s.after_url, `${title}, depois`, { w: 1200, h: 900 })}<figcaption>Depois</figcaption></figure>${s.caption ? `<p class="dyn-ba-cap">${esc(s.caption)}</p>` : ""}</div>`;
    case "video":
      return s.provider === "file" ? `<video class="dyn-video" src="${attr(s.url)}" controls preload="none" playsinline></video>` : `<div class="dyn-embed"><iframe src="${attr(s.embed_url)}" title="V\xEDdeo do projeto ${attr(title)}" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`;
    case "testimonial":
      return `<figure class="dyn-review dyn-review-wide"><span class="dyn-stars" aria-label="nota ${s.rating} de 5">${"\u2605".repeat(s.rating)}${"\u2606".repeat(5 - s.rating)}</span><blockquote>${esc(s.body)}</blockquote><figcaption>${esc(s.client_name)}</figcaption></figure>`;
    default:
      return "";
  }
}, "block");
async function onRequestGet3(ctx) {
  const parts = (ctx.params.path || []).filter(Boolean);
  if (parts.length !== 1 || !/^[a-z0-9-]{2,80}$/.test(parts[0])) return ctx.next();
  try {
    const p = await api(ctx.env, `/api/public/projetos/${parts[0]}`);
    if (!p) return ctx.next();
    const pro = p.projetista;
    const meta = [["Ambiente", p.ambiente], ["Local", p.location], ["Ano", p.year], ["Projetista", pro ? `<a href="/projetistas/${attr(pro.slug)}">${esc(pro.name)}</a>` : null], ["Loja", pro?.store?.name]].filter(([, v]) => v).map(([k, v]) => `<div><span>${k}</span><strong>${k === "Projetista" ? v : esc(v)}</strong></div>`).join("");
    return page(
      {
        title: p.title,
        description: p.description || `Projeto ${p.title} da Live Ambientes${p.location ? `, ${p.location}` : ""}.`,
        path: `/projetos/${p.slug}`,
        image: p.cover_url,
        type: "article",
        preload: p.cover_url,
        jsonld: {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: p.title,
          description: p.description || void 0,
          image: p.cover_url || void 0,
          url: `${SITE}/projetos/${p.slug}`,
          dateCreated: p.year ? String(p.year) : void 0,
          locationCreated: p.location ? { "@type": "Place", name: p.location } : void 0,
          creator: pro ? { "@type": "Person", name: pro.name, url: `${SITE}/projetistas/${pro.slug}` } : void 0,
          publisher: { "@type": "Organization", name: "Live Ambientes", url: SITE }
        }
      },
      `${`<section class="ambiente-hero">${p.cover_url ? img(p.cover_url, p.title, { w: 1600, h: 900, eager: true }) : ""}<div class="container"><span class="eyebrow on-dark">${esc(["Projeto", p.location, p.year].filter(Boolean).join(" \xB7 "))}</span><h1>${esc(p.title)}</h1>${p.description ? `<p>${esc(p.description)}</p>` : ""}</div></section>`}
<section class="section section-light"><div class="container">
  <div class="projeto-meta">${meta}</div>
  ${pro ? `<div class="dyn-pro-strip">${pro.avatar_url ? `<span class="dyn-avatar">${img(pro.avatar_url, "", { w: 96, h: 96 })}</span>` : ""}<div><strong>${esc(pro.name)}</strong>${statusBadge(pro.status)}<span>${esc(pro.headline ?? "")}</span></div>
    ${p.cta_enabled ? '<a class="btn btn-primary" href="#orcamento-projetista">Pedir or\xE7amento</a>' : ""}</div>` : ""}
  <div class="dyn-blocks">${p.sections.map((s) => `<div class="dyn-block dyn-block-${attr(s.type)}">${block(s, p.title)}</div>`).join("")}</div>
</div></section>
${p.cta_enabled && pro ? ctaBlock(ctx.env, pro, p.slug) : ""}`,
      { scripts: p.cta_enabled && pro ? ctaScripts(ctx.env) : "" }
    );
  } catch (e) {
    console.log("projetos: falha", e && e.message);
    return errorPage();
  }
}
__name(onRequestGet3, "onRequestGet3");
__name2(onRequestGet3, "onRequestGet");
var LOJA_EMAILS = {
  "Recreio": "recreio@liveambientes.com.br",
  "Tijuca": "gerencia@grupomoveisflexx.com",
  "Niter\xF3i": "gerencia@grupomoveisflexx.com"
};
var ALL_EMAILS = [...new Set(Object.values(LOJA_EMAILS))];
var json = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8" }
}), "json");
var cleanHeaderField = /* @__PURE__ */ __name2((v) => String(v ?? "").replace(/[\r\n]+/g, " ").trim(), "cleanHeaderField");
var isValidEmail = /* @__PURE__ */ __name2((v) => /^[^\s@<>(),;:"\[\]\\]+@[^\s@<>(),;:"\[\]\\]+\.[^\s@<>(),;:"\[\]\\]+$/.test(v), "isValidEmail");
function toBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 32768) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 32768));
  }
  return btoa(bin);
}
__name(toBase64, "toBase64");
__name2(toBase64, "toBase64");
var STORE_SLUGS = { recreio: "recreio", tijuca: "tijuca", niteroi: "niteroi" };
var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
var KNOWN_FIELDS = /* @__PURE__ */ new Set(["form_type", "nome", "telefone", "email", "loja", "mensagem", "detalhes", "comodos[]", "comodos", "planta", ...UTM_KEYS]);
var normalize = /* @__PURE__ */ __name2((v) => String(v ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(), "normalize");
async function sendToBackoffice(env, lead) {
  if (!env.BACKOFFICE_INGEST_TOKEN) return;
  try {
    const base = env.BACKOFFICE_URL || "https://liveambientes-backoffice.liveambientes.workers.dev";
    const res = await fetch(`${base}/api/leads/ingest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.BACKOFFICE_INGEST_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(5e3)
    });
    if (!res.ok) console.log(`backoffice ingest failed: ${res.status}`);
  } catch (e) {
    console.log(`backoffice ingest failed: ${e?.name || "error"}`);
  }
}
__name(sendToBackoffice, "sendToBackoffice");
__name2(sendToBackoffice, "sendToBackoffice");
function buildLead({ form, request, formType, nome, email, telefone, loja, mensagem, detalhes, comodos }) {
  const lines = [];
  if (formType === "orcamento") {
    if (comodos.length) lines.push(`C\xF4modos de interesse: ${comodos.map(cleanHeaderField).join(", ")}`);
    if (detalhes) lines.push(detalhes);
  } else if (mensagem) {
    lines.push(mensagem);
  }
  for (const [k, v] of form.entries()) {
    if (KNOWN_FIELDS.has(k) || typeof v !== "string" || v.trim() === "") continue;
    lines.push(`${k}: ${v.trim()}`);
  }
  const lead = {
    external_id: `site-${crypto.randomUUID()}`,
    name: nome,
    email,
    phone: telefone,
    message: lines.join("\n"),
    source: "site"
  };
  const slug = STORE_SLUGS[normalize(loja)];
  if (slug) lead.store_slug = slug;
  let ref = null;
  try {
    const u = new URL(request.headers.get("Referer") || "");
    if (u.protocol === "http:" || u.protocol === "https:") ref = u;
  } catch {
  }
  if (ref) lead.page_url = ref.href;
  for (const k of UTM_KEYS) {
    const v = form.get(k);
    const val = typeof v === "string" && v.trim() !== "" ? v.trim() : ref?.searchParams.get(k);
    if (val) lead[k] = val;
  }
  const attachments = [];
  for (const [, v] of form.entries()) {
    if (v && typeof v !== "string" && v.size > 0) {
      attachments.push({ name: (v.name || "arquivo").split(/[\\/]/).pop(), size: v.size, type: v.type || "application/octet-stream" });
    }
  }
  if (attachments.length) lead.attachments = attachments;
  return lead;
}
__name(buildLead, "buildLead");
__name2(buildLead, "buildLead");
async function onRequestPost({ request, env, waitUntil }) {
  let form;
  try {
    form = await request.formData();
  } catch {
    form = new FormData();
  }
  const str = /* @__PURE__ */ __name2((k) => {
    const v = form.get(k);
    return typeof v === "string" ? v : "";
  }, "str");
  const formType = cleanHeaderField(str("form_type"));
  const nome = cleanHeaderField(str("nome"));
  const telefone = cleanHeaderField(str("telefone"));
  const email = cleanHeaderField(str("email"));
  const loja = cleanHeaderField(str("loja"));
  const mensagem = str("mensagem").trim();
  const detalhes = str("detalhes").trim();
  const comodos = [...form.getAll("comodos[]"), ...form.getAll("comodos")].filter((v) => typeof v === "string");
  if (email !== "" && !isValidEmail(email)) {
    return json({ ok: false, error: "E-mail inv\xE1lido" }, 400);
  }
  let to, subject, body;
  switch (formType) {
    case "orcamento":
      if (nome === "" || telefone === "" || email === "" || loja === "") {
        return json({ ok: false, error: "Campos obrigat\xF3rios faltando" }, 400);
      }
      to = LOJA_EMAILS[loja] ? [LOJA_EMAILS[loja]] : ALL_EMAILS;
      subject = `Novo or\xE7amento pelo site \u2014 Loja ${loja}`;
      body = `Nome: ${nome}
`;
      body += `Telefone/WhatsApp: ${telefone}
`;
      body += `E-mail: ${email}
`;
      body += `Loja: ${loja}
`;
      body += `C\xF4modos de interesse: ${comodos.map(cleanHeaderField).join(", ")}

`;
      body += `Detalhes do projeto:
${detalhes}
`;
      break;
    case "contato":
      if (nome === "" || telefone === "") {
        return json({ ok: false, error: "Campos obrigat\xF3rios faltando" }, 400);
      }
      to = [LOJA_EMAILS["Recreio"]];
      subject = "Nova mensagem de contato pelo site";
      body = `Nome: ${nome}
`;
      body += `Telefone/WhatsApp: ${telefone}
`;
      body += `E-mail: ${email}

`;
      body += `Mensagem:
${mensagem}
`;
      break;
    case "newsletter":
      if (email === "") {
        return json({ ok: false, error: "E-mail obrigat\xF3rio" }, 400);
      }
      to = [LOJA_EMAILS["Recreio"]];
      subject = "Nova inscri\xE7\xE3o na newsletter pelo site";
      body = `E-mail inscrito: ${email}
`;
      break;
    default:
      return json({ ok: false, error: "Tipo de formul\xE1rio inv\xE1lido" }, 400);
  }
  if (env.TEST_RECIPIENT) to = [env.TEST_RECIPIENT];
  const payload = { from: env.MAIL_FROM, to, subject, text: body };
  if (email !== "") payload.reply_to = email;
  const planta = form.get("planta");
  if (formType === "orcamento" && planta && typeof planta !== "string" && planta.size > 0) {
    const filename = (planta.name || "planta").split(/[\\/]/).pop();
    payload.attachments = [{
      filename,
      content: toBase64(await planta.arrayBuffer()),
      content_type: planta.type || "application/octet-stream"
    }];
  }
  let ok = false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    ok = res.ok;
  } catch {
    ok = false;
  }
  if (formType === "orcamento" || formType === "contato") {
    try {
      const lead = buildLead({ form, request, formType, nome, email, telefone, loja, mensagem, detalhes, comodos });
      waitUntil(sendToBackoffice(env, lead));
    } catch (e) {
      console.log(`backoffice ingest failed: ${e?.name || "error"}`);
    }
  }
  return json({ ok });
}
__name(onRequestPost, "onRequestPost");
__name2(onRequestPost, "onRequestPost");
function onRequest() {
  return json({ ok: false, error: "Method not allowed" }, 405);
}
__name(onRequest, "onRequest");
__name2(onRequest, "onRequest");
var STATIC = ["/", "/projetistas", "/blog", "/politica-de-privacidade.html", "/projetos/marina-paiva.html"];
var x = /* @__PURE__ */ __name2((s) => String(s).replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`), "x");
async function onRequestGet4({ env }) {
  const urls = STATIC.map((p) => ({ loc: SITE + p }));
  try {
    const [blog, pros] = await Promise.all([api(env, "/api/public/blog/posts?per=50&page=1"), api(env, "/api/public/projetistas")]);
    for (const p of blog?.posts ?? []) urls.push({ loc: `${SITE}/blog/${p.slug}`, lastmod: p.updated_at || p.published_at });
    const details = await Promise.all((pros?.projetistas ?? []).slice(0, 100).map((p) => api(env, `/api/public/projetistas/${p.slug}`).catch(() => null)));
    for (const d of details.filter(Boolean)) {
      urls.push({ loc: `${SITE}/projetistas/${d.slug}` });
      for (const pj of d.projects) urls.push({ loc: `${SITE}/projetos/${pj.slug}` });
    }
  } catch (e) {
    console.log("sitemap: API indispon\xEDvel, s\xF3 p\xE1ginas fixas", e && e.message);
  }
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...new Map(urls.map((u) => [u.loc, u])).values()].map((u) => `  <url><loc>${x(u.loc)}</loc>${u.lastmod ? `<lastmod>${x(u.lastmod.slice(0, 10))}</lastmod>` : ""}</url>`).join("\n")}
</urlset>
`;
  return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
__name(onRequestGet4, "onRequestGet4");
__name2(onRequestGet4, "onRequestGet");
var routes = [
  {
    routePath: "/blog/:path*",
    mountPath: "/blog",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/projetistas/:path*",
    mountPath: "/projetistas",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/projetos/:path*",
    mountPath: "/projetos",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  },
  {
    routePath: "/send-form.php",
    mountPath: "/",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/sitemap.xml",
    mountPath: "/",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet4]
  },
  {
    routePath: "/send-form.php",
    mountPath: "/",
    method: "",
    middlewares: [],
    modules: [onRequest]
  }
];
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
__name2(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name2(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name2(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name2(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name2(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name2(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
__name2(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
__name2(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x2) {
    return x2;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name2(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
__name2(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
__name2(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
__name2(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
__name2(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
__name2(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
__name2(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x2) {
    return x2;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
__name2(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");
__name2(pathToRegexp, "pathToRegexp");
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function getOriginalPathPrefix(requestPath, normalizedPrefix) {
  let end = 0;
  for (let index = 0; index < normalizedPrefix.length; index++) {
    end++;
    if (normalizedPrefix[index] === "/") {
      while (requestPath[end] === "/") {
        end++;
      }
    }
  }
  return requestPath.slice(0, end);
}
__name(getOriginalPathPrefix, "getOriginalPathPrefix");
__name2(getOriginalPathPrefix, "getOriginalPathPrefix");
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  const normalizedRequestPath = requestPath.replace(/\/+/g, "/");
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath) || routeMatcher(normalizedRequestPath);
    const originalMountMatch = mountMatcher(requestPath);
    const mountMatchResult = originalMountMatch || mountMatcher(normalizedRequestPath);
    if (matchResult && mountMatchResult) {
      const path = originalMountMatch ? originalMountMatch.path : getOriginalPathPrefix(requestPath, mountMatchResult.path);
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
__name2(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name2(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name2(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name2((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
var drainBody = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
__name2(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
__name2(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
__name2(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");
__name2(__facade_invoke__, "__facade_invoke__");
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  static {
    __name(this, "___Facade_ScheduledController__");
  }
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name2(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name2(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name2(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
__name2(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name2((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name2((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
__name2(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;

// ../../home/box/.npm/_npx/c943b712072b77c4/node_modules/wrangler/templates/pages-dev-util.ts
function isRoutingRuleMatch(pathname, routingRule) {
  if (!pathname) {
    throw new Error("Pathname is undefined.");
  }
  if (!routingRule) {
    throw new Error("Routing rule is undefined.");
  }
  const ruleRegExp = transformRoutingRuleToRegExp(routingRule);
  return pathname.match(ruleRegExp) !== null;
}
__name(isRoutingRuleMatch, "isRoutingRuleMatch");
function transformRoutingRuleToRegExp(rule) {
  let transformedRule;
  if (rule === "/" || rule === "/*") {
    transformedRule = rule;
  } else if (rule.endsWith("/*")) {
    transformedRule = `${rule.substring(0, rule.length - 2)}(/*)?`;
  } else if (rule.endsWith("/")) {
    transformedRule = `${rule.substring(0, rule.length - 1)}(/)?`;
  } else if (rule.endsWith("*")) {
    transformedRule = rule;
  } else {
    transformedRule = `${rule}(/)?`;
  }
  transformedRule = `^${transformedRule.replaceAll(/\./g, "\\.").replaceAll(/\*/g, ".*")}$`;
  return new RegExp(transformedRule);
}
__name(transformRoutingRuleToRegExp, "transformRoutingRuleToRegExp");

// ../.wrangler/tmp/pages-SNhcK6/jq47kj4czs9.js
var define_ROUTES_default = {
  version: 1,
  include: ["/send-form.php", "/blog", "/blog/*", "/projetistas", "/projetistas/*", "/projetos/*", "/sitemap.xml"],
  exclude: ["/projetos/*.html", "/assets/*", "/css/*", "/js/*"]
};
var routes2 = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes2.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes2.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = middleware_loader_entry_default;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};

// ../../home/box/.npm/_npx/c943b712072b77c4/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default2 = drainBody2;

// ../../home/box/.npm/_npx/c943b712072b77c4/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError2(e.cause)
  };
}
__name(reduceError2, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError2(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default2 = jsonError2;

// .wrangler/tmp/bundle-OdOTcT/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = pages_dev_pipeline_default;

// ../../home/box/.npm/_npx/c943b712072b77c4/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
__name(__facade_register__2, "__facade_register__");
function __facade_invokeChain__2(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__2, "__facade_invokeChain__");
function __facade_invoke__2(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
__name(__facade_invoke__2, "__facade_invoke__");

// .wrangler/tmp/bundle-OdOTcT/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class ___Facade_ScheduledController__2 {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler2(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__2(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__2(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler2, "wrapExportedHandler");
function wrapWorkerEntrypoint2(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__2(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__2(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint2, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY2;
if (typeof middleware_insertion_facade_default2 === "object") {
  WRAPPED_ENTRY2 = wrapExportedHandler2(middleware_insertion_facade_default2);
} else if (typeof middleware_insertion_facade_default2 === "function") {
  WRAPPED_ENTRY2 = wrapWorkerEntrypoint2(middleware_insertion_facade_default2);
}
var middleware_loader_entry_default2 = WRAPPED_ENTRY2;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__2 as __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default2 as default
};
//# sourceMappingURL=jq47kj4czs9.js.map
