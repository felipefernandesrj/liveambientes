// /projetistas (lista) e /projetistas/<slug> (perfil: status, velocidade, pastas, projetos, artigos, depoimentos).
import { api, attr, errorPage, esc, fmtSpeed, hero, img, notFound, page, SITE, statusBadge } from '../_lib/site.js';
import { ctaBlock, ctaScripts } from '../_lib/cta.js';

const projCard = (p) => `<article class="dyn-card"><a class="dyn-card-link" href="/projetos/${attr(p.slug)}">
  <div class="dyn-card-media">${img(p.cover_url, p.title, { w: 800, h: 600 })}</div>
  <div class="dyn-card-body"><span class="eyebrow">${esc([p.ambiente, p.location, p.year].filter(Boolean).join(' · '))}</span><h3 class="dyn-card-title">${esc(p.title)}</h3></div></a></article>`;
const stars = (n) => `<span class="dyn-stars" aria-label="nota ${n} de 5">${'★'.repeat(n)}${'☆'.repeat(5 - n)}</span>`;

export async function onRequestGet({ env, params }) {
  const parts = (params.path || []).filter(Boolean);
  try {
    if (!parts.length) {
      const d = await api(env, '/api/public/projetistas');
      const list = d?.projetistas ?? [];
      return page({ title: 'Projetistas', description: 'Conheça os projetistas da Live Ambientes e fale direto com quem vai desenhar o seu projeto.', path: '/projetistas',
        jsonld: { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: list.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/projetistas/${p.slug}`, name: p.name })) } },
        `${hero({ eyebrow: 'Equipe', title: 'Nossos projetistas', text: 'Escolha quem vai desenhar o seu projeto e fale direto com essa pessoa.', compact: true })}
<section class="section section-light"><div class="container">
  ${list.length ? `<ul class="dyn-people">${list.map((p) => `<li><a class="dyn-person" href="/projetistas/${attr(p.slug)}">
    <span class="dyn-avatar">${p.avatar_url ? img(p.avatar_url, '', { w: 160, h: 160 }) : `<span aria-hidden="true">${esc(p.name.slice(0, 1))}</span>`}</span>
    <span class="dyn-person-body"><strong>${esc(p.name)}</strong><span>${esc(p.headline ?? '')}</span>
      <span class="dyn-meta">${esc(p.store?.name ?? '')}${fmtSpeed(p.response_minutes) ? ` · responde em ~${esc(fmtSpeed(p.response_minutes))}` : ''}</span>
      ${(p.specialties || []).length ? `<span class="dyn-chips">${p.specialties.slice(0, 3).map((s) => `<span class="dyn-chip">${esc(s)}</span>`).join('')}</span>` : ''}</span></a></li>`).join('')}</ul>`
        : '<p class="dyn-empty">Em breve, os perfis dos nossos projetistas.</p>'}
</div></section>`);
    }
    if (parts.length !== 1 || !/^[a-z0-9-]{2,80}$/.test(parts[0])) return notFound('Projetista');
    const p = await api(env, `/api/public/projetistas/${parts[0]}`);
    if (!p) return notFound('Projetista');
    const speed = fmtSpeed(p.response_minutes);
    const loose = p.projects.filter((x) => !p.folders.some((f) => f.projects.some((y) => y.slug === x.slug)));
    const sections = [...p.folders.filter((f) => f.projects.length), ...(loose.length ? [{ title: p.folders.length ? 'Outros projetos' : 'Projetos', slug: 'projetos', projects: loose }] : [])];
    return page({ title: `${p.name}, projetista`, description: p.headline || `Projetos de ${p.name} na Live Ambientes ${p.store?.name ?? ''}.`, path: `/projetistas/${p.slug}`, image: p.cover_url || p.avatar_url, type: 'profile', preload: p.cover_url,
      jsonld: { '@context': 'https://schema.org', '@type': 'Person', name: p.name, jobTitle: 'Projetista de móveis planejados', description: p.headline || undefined, image: p.avatar_url || undefined,
        url: `${SITE}/projetistas/${p.slug}`, worksFor: { '@type': 'Organization', name: `Live Ambientes ${p.store?.name ?? ''}`.trim(), url: SITE },
        sameAs: [p.instagram && `https://instagram.com/${p.instagram}`, p.pinterest && `https://pinterest.com/${p.pinterest}`].filter(Boolean),
        ...(p.rating ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: p.rating.average, reviewCount: p.rating.count } } : {}) } },
      `${hero({ eyebrow: `Projetista · ${p.store?.name ?? ''}`, title: p.name, text: p.headline, image: p.cover_url, alt: '' })}
<section class="section section-light"><div class="container dyn-profile">
  <div class="dyn-profile-card">
    <span class="dyn-avatar dyn-avatar-lg">${p.avatar_url ? img(p.avatar_url, `Foto de ${p.name}`, { w: 240, h: 240, eager: true }) : `<span aria-hidden="true">${esc(p.name.slice(0, 1))}</span>`}</span>
    ${statusBadge(p.status)}
    <dl class="dyn-facts">
      ${speed ? `<div><dt>Tempo de resposta</dt><dd>~${esc(speed)}</dd></div>` : ''}
      ${p.rating ? `<div><dt>Avaliação</dt><dd>${esc(String(p.rating.average).replace('.', ','))} de 5 (${p.rating.count})</dd></div>` : ''}
      <div><dt>Loja</dt><dd>${esc(p.store?.name ?? '')}</dd></div>
    </dl>
    <div class="dyn-actions"><a class="btn btn-primary" href="#orcamento-projetista">Pedir orçamento</a></div>
    <p class="dyn-social">${p.instagram ? `<a href="https://instagram.com/${attr(p.instagram)}" target="_blank" rel="noopener">Instagram</a>` : ''}${p.pinterest ? `<a href="https://pinterest.com/${attr(p.pinterest)}" target="_blank" rel="noopener">Pinterest</a>` : ''}</p>
  </div>
  <div class="dyn-profile-main">
    ${p.bio ? `<div class="dyn-prose"><p>${esc(p.bio).replace(/\n+/g, '</p><p>')}</p></div>` : ''}
    ${(p.specialties || []).length ? `<p class="dyn-chips">${p.specialties.map((s) => `<span class="dyn-chip">${esc(s)}</span>`).join('')}</p>` : ''}
  </div>
</div></section>
${sections.map((f) => `<section class="section section-light dyn-tight" aria-labelledby="h-${attr(f.slug)}"><div class="container">
  <div class="section-head"><h2 id="h-${attr(f.slug)}">${esc(f.title)}</h2>${f.description ? `<p>${esc(f.description)}</p>` : ''}</div>
  <div class="dyn-grid">${f.projects.map(projCard).join('')}</div></div></section>`).join('')}
${p.reviews.length ? `<section class="section section-tint" aria-labelledby="h-rev"><div class="container"><div class="section-head"><h2 id="h-rev">O que dizem os clientes</h2></div>
  <div class="dyn-reviews">${p.reviews.map((r) => `<figure class="dyn-review">${stars(r.rating)}<blockquote>${esc(r.body)}</blockquote><figcaption>${esc(r.client_name)}</figcaption></figure>`).join('')}</div></div></section>` : ''}
${p.articles.length ? `<section class="section section-light dyn-tight" aria-labelledby="h-art"><div class="container"><div class="section-head"><h2 id="h-art">Artigos de ${esc(p.name.split(' ')[0])}</h2></div>
  <div class="dyn-grid">${p.articles.map((a) => `<article class="dyn-card"><a class="dyn-card-link" href="/blog/${attr(a.slug)}"><div class="dyn-card-media">${img(a.cover_url, '', { w: 800, h: 500 })}</div><div class="dyn-card-body"><h3 class="dyn-card-title">${esc(a.title)}</h3>${a.excerpt ? `<p>${esc(a.excerpt)}</p>` : ''}</div></a></article>`).join('')}</div>
  <p><a class="btn btn-ghost" href="/blog/autor/${attr(p.slug)}">Todos os artigos</a></p></div></section>` : ''}
${ctaBlock(env, p)}`, { scripts: ctaScripts(env) });
  } catch (e) {
    console.log('projetistas: falha', e && e.message);
    return errorPage();
  }
}
