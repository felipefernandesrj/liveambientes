// /projetos/<slug>: landing por blocos vinda do backoffice. Páginas estáticas (ex.: marina-paiva.html) seguem como estão.
import { api, attr, errorPage, esc, img, page, SITE, statusBadge } from '../_lib/site.js';
import { ctaBlock, ctaScripts } from '../_lib/cta.js';

const block = (s, title) => {
  switch (s.type) {
    case 'floor_plan': return /\.pdf$/i.test(s.url) ? `<p class="dyn-plan"><a class="btn btn-outline-dark" href="${attr(s.url)}" target="_blank" rel="noopener">Ver a planta (PDF)</a></p>`
      : `<figure class="dyn-figure dyn-plan">${img(s.url, `Planta do projeto ${title}`, { w: 1600, h: 1000 })}<figcaption>Planta</figcaption></figure>`;
    case 'text': return `<div class="dyn-prose">${s.html}</div>`;
    case 'gallery': return `<div class="dyn-gallery">${s.images.map((x, i) => `<a href="${attr(x.url)}" target="_blank" rel="noopener">${img(x.url, `${title}, foto ${i + 1}`, { w: 1200, h: 900 })}</a>`).join('')}</div>`;
    case 'before_after': return `<div class="dyn-ba"><figure>${img(s.before_url, `${title}, antes`, { w: 1200, h: 900 })}<figcaption>Antes</figcaption></figure><figure>${img(s.after_url, `${title}, depois`, { w: 1200, h: 900 })}<figcaption>Depois</figcaption></figure>${s.caption ? `<p class="dyn-ba-cap">${esc(s.caption)}</p>` : ''}</div>`;
    case 'video': return s.provider === 'file' ? `<video class="dyn-video" src="${attr(s.url)}" controls preload="none" playsinline></video>`
      : `<div class="dyn-embed"><iframe src="${attr(s.embed_url)}" title="Vídeo do projeto ${attr(title)}" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`;
    case 'testimonial': return `<figure class="dyn-review dyn-review-wide"><span class="dyn-stars" aria-label="nota ${s.rating} de 5">${'★'.repeat(s.rating)}${'☆'.repeat(5 - s.rating)}</span><blockquote>${esc(s.body)}</blockquote><figcaption>${esc(s.client_name)}</figcaption></figure>`;
    default: return '';
  }
};

export async function onRequestGet(ctx) {
  const parts = (ctx.params.path || []).filter(Boolean);
  // Arquivos estáticos (projetos/*.html, imagens) seguem para os assets.
  if (parts.length !== 1 || !/^[a-z0-9-]{2,80}$/.test(parts[0])) return ctx.next();
  try {
    const p = await api(ctx.env, `/api/public/projetos/${parts[0]}`);
    if (!p) return ctx.next();
    const pro = p.projetista;
    const meta = [['Ambiente', p.ambiente], ['Local', p.location], ['Ano', p.year], ['Projetista', pro ? `<a href="/projetistas/${attr(pro.slug)}">${esc(pro.name)}</a>` : null], ['Loja', pro?.store?.name]]
      .filter(([, v]) => v).map(([k, v]) => `<div><span>${k}</span><strong>${k === 'Projetista' ? v : esc(v)}</strong></div>`).join('');
    return page({ title: p.title, description: p.description || `Projeto ${p.title} da Live Ambientes${p.location ? `, ${p.location}` : ''}.`, path: `/projetos/${p.slug}`, image: p.cover_url, type: 'article', preload: p.cover_url,
      jsonld: { '@context': 'https://schema.org', '@type': 'CreativeWork', name: p.title, description: p.description || undefined, image: p.cover_url || undefined, url: `${SITE}/projetos/${p.slug}`,
        dateCreated: p.year ? String(p.year) : undefined, locationCreated: p.location ? { '@type': 'Place', name: p.location } : undefined,
        creator: pro ? { '@type': 'Person', name: pro.name, url: `${SITE}/projetistas/${pro.slug}` } : undefined, publisher: { '@type': 'Organization', name: 'Live Ambientes', url: SITE } } },
      `${`<section class="ambiente-hero">${p.cover_url ? img(p.cover_url, p.title, { w: 1600, h: 900, eager: true }) : ''}<div class="container"><span class="eyebrow on-dark">${esc(['Projeto', p.location, p.year].filter(Boolean).join(' · '))}</span><h1>${esc(p.title)}</h1>${p.description ? `<p>${esc(p.description)}</p>` : ''}</div></section>`}
<section class="section section-light"><div class="container">
  <div class="projeto-meta">${meta}</div>
  ${pro ? `<div class="dyn-pro-strip">${pro.avatar_url ? `<span class="dyn-avatar">${img(pro.avatar_url, '', { w: 96, h: 96 })}</span>` : ''}<div><strong>${esc(pro.name)}</strong>${statusBadge(pro.status)}<span>${esc(pro.headline ?? '')}</span></div>
    ${p.cta_enabled ? '<a class="btn btn-primary" href="#orcamento-projetista">Pedir orçamento</a>' : ''}</div>` : ''}
  <div class="dyn-blocks">${p.sections.map((s) => `<div class="dyn-block dyn-block-${attr(s.type)}">${block(s, p.title)}</div>`).join('')}</div>
</div></section>
${p.cta_enabled && pro ? ctaBlock(ctx.env, pro, p.slug) : ''}`, { scripts: p.cta_enabled && pro ? ctaScripts(ctx.env) : '' });
  } catch (e) {
    console.log('projetos: falha', e && e.message);
    return errorPage();
  }
}
