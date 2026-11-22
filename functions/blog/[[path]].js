// /blog (lista), /blog/<slug> (post), /blog/autor/<slug> (artigos de um projetista).
import { api, attr, errorPage, esc, fmtDate, hero, img, notFound, page, SITE } from '../_lib/site.js';

const card = (p) => `<article class="dyn-card">
  <a href="/blog/${attr(p.slug)}" class="dyn-card-link">
    <div class="dyn-card-media">${img(p.cover_url, '', { w: 800, h: 500 })}</div>
    <div class="dyn-card-body">
      <span class="eyebrow">${esc(fmtDate(p.published_at))}${p.author ? ` · ${esc(p.author.name)}` : ''}</span>
      <h2 class="dyn-card-title">${esc(p.title)}</h2>
      ${p.excerpt ? `<p>${esc(p.excerpt)}</p>` : ''}
    </div>
  </a>
</article>`;

const pager = (base, pg, total, per) => {
  const pages = Math.ceil(total / per);
  if (pages <= 1) return '';
  const link = (n, label, rel) => `<a class="btn btn-ghost" href="${base}${base.includes('?') ? '&' : '?'}pagina=${n}"${rel ? ` rel="${rel}"` : ''}>${label}</a>`;
  return `<nav class="dyn-pager" aria-label="Paginação">${pg > 1 ? link(pg - 1, '← Anteriores', 'prev') : '<span></span>'}<span>Página ${pg} de ${pages}</span>${pg < pages ? link(pg + 1, 'Próximos →', 'next') : '<span></span>'}</nav>`;
};

export async function onRequestGet({ request, env, params }) {
  const parts = (params.path || []).filter(Boolean);
  const url = new URL(request.url);
  const pg = Math.max(1, Number(url.searchParams.get('pagina')) || 1);
  const tag = /^[\p{L}\d -]{1,40}$/u.test(url.searchParams.get('tag') ?? '') ? url.searchParams.get('tag') : null;
  try {
    // Lista geral ou por tag.
    if (!parts.length) {
      const d = await api(env, `/api/public/blog/posts?per=12&page=${pg}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`);
      const posts = d?.posts ?? [];
      return page({ title: tag ? `Blog: ${tag}` : 'Blog', description: 'Ideias, projetos e dicas de móveis planejados da Live Ambientes.', path: `/blog${tag ? `?tag=${encodeURIComponent(tag)}` : ''}`,
        jsonld: { '@context': 'https://schema.org', '@type': 'Blog', name: 'Blog Live Ambientes', url: `${SITE}/blog` } },
        `${hero({ eyebrow: 'Blog', title: tag ? `Tema: ${tag}` : 'Ideias para o seu projeto', text: 'Planejamento, materiais e projetos reais da Live Ambientes.', compact: true })}
<section class="section section-light"><div class="container">
  ${posts.length ? `<div class="dyn-grid">${posts.map(card).join('')}</div>` : '<p class="dyn-empty">Nenhum artigo publicado ainda.</p>'}
  ${pager(`/blog${tag ? `?tag=${encodeURIComponent(tag)}` : ''}`, pg, d?.total ?? 0, 12)}
</div></section>`);
    }
    // Artigos de um autor.
    if (parts[0] === 'autor' && parts[1] && parts.length === 2) {
      const [pro, d] = await Promise.all([api(env, `/api/public/projetistas/${encodeURIComponent(parts[1])}`), api(env, `/api/public/blog/posts?per=12&page=${pg}&author=${encodeURIComponent(parts[1])}`)]);
      if (!pro) return notFound('Autor');
      return page({ title: `Artigos de ${pro.name}`, description: `Artigos de ${pro.name}, projetista da Live Ambientes ${pro.store?.name ?? ''}.`, path: `/blog/autor/${parts[1]}`, image: pro.avatar_url,
        jsonld: { '@context': 'https://schema.org', '@type': 'Person', name: pro.name, url: `${SITE}/projetistas/${pro.slug}`, image: pro.avatar_url ?? undefined } },
        `${hero({ eyebrow: 'Blog · Autor', title: pro.name, text: pro.headline, compact: true })}
<section class="section section-light"><div class="container">
  <p class="dyn-lead"><a class="btn btn-outline-dark" href="/projetistas/${attr(pro.slug)}">Ver perfil e projetos</a></p>
  ${d?.posts?.length ? `<div class="dyn-grid">${d.posts.map(card).join('')}</div>` : '<p class="dyn-empty">Nenhum artigo publicado ainda.</p>'}
  ${pager(`/blog/autor/${parts[1]}`, pg, d?.total ?? 0, 12)}
</div></section>`);
    }
    // Post.
    if (parts.length !== 1 || !/^[a-z0-9-]{1,80}$/.test(parts[0])) return notFound('Artigo');
    const p = await api(env, `/api/public/blog/posts/${parts[0]}`);
    if (!p) return notFound('Artigo');
    const author = p.author?.slug ? `<a href="/blog/autor/${attr(p.author.slug)}">${esc(p.author.name)}</a>` : esc(p.author?.name ?? 'Live Ambientes');
    return page({ title: p.seo?.title || p.title, description: p.seo?.description || p.excerpt || '', path: `/blog/${p.slug}`, image: p.cover_url, type: 'article', preload: p.cover_url,
      jsonld: { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.seo?.description || p.excerpt || undefined, image: p.cover_url || undefined,
        datePublished: p.published_at, dateModified: p.updated_at, mainEntityOfPage: `${SITE}/blog/${p.slug}`, keywords: (p.tags || []).join(', ') || undefined,
        author: p.author ? { '@type': 'Person', name: p.author.name, url: p.author.slug ? `${SITE}/projetistas/${p.author.slug}` : undefined } : { '@type': 'Organization', name: 'Live Ambientes' },
        publisher: { '@type': 'Organization', name: 'Live Ambientes', url: SITE } } },
      `${hero({ eyebrow: fmtDate(p.published_at), title: p.title, text: p.excerpt, image: p.cover_url, alt: '' })}
<section class="section section-light"><div class="container dyn-article">
  <p class="dyn-byline">Por ${author}${(p.tags || []).length ? ` · ${p.tags.map((t) => `<a class="dyn-tag" href="/blog?tag=${encodeURIComponent(t)}">${esc(t)}</a>`).join(' ')}` : ''}</p>
  <div class="dyn-prose">${p.body_html}</div>
  <div class="ambiente-cta" style="margin-top:3rem"><h2>Quer um projeto como este?</h2><a href="/#orcamento" class="btn btn-primary">Solicitar Orçamento</a></div>
</div></section>`);
  } catch (e) {
    console.log('blog: falha', e && e.message);
    return errorPage();
  }
}
