import { attr, esc } from './site.js';

/** CTA "Pedir orçamento com <nome>" (form com Turnstile) + "Conversar no WhatsApp" (clique registrado). */
export function ctaBlock(env, pro, itemSlug) {
  const key = env.TURNSTILE_SITE_KEY;
  const first = (pro.name || '').split(' ')[0];
  const wa = pro.whatsapp_url ? `<a class="btn btn-outline-dark" href="${attr(pro.whatsapp_url)}" target="_blank" rel="noopener" data-wa data-pro="${attr(pro.slug)}"${itemSlug ? ` data-item="${attr(itemSlug)}"` : ''}>Conversar no WhatsApp</a>` : '';
  const form = key ? `<form class="dyn-form" id="pedido" data-pro="${attr(pro.slug)}"${itemSlug ? ` data-item="${attr(itemSlug)}"` : ''} novalidate>
    <div class="dyn-form-grid">
      <div class="dyn-field"><label for="f-name">Nome *</label><input id="f-name" name="name" autocomplete="name" required maxlength="120"></div>
      <div class="dyn-field"><label for="f-phone">WhatsApp ou telefone *</label><input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required maxlength="30"></div>
      <div class="dyn-field dyn-span2"><label for="f-email">E-mail</label><input id="f-email" name="email" type="email" autocomplete="email" maxlength="200"></div>
      <div class="dyn-field dyn-span2"><label for="f-msg">Conte sobre o seu projeto</label><textarea id="f-msg" name="message" rows="4" maxlength="2000"></textarea></div>
    </div>
    <div class="cf-turnstile" data-sitekey="${attr(key)}" data-language="pt-br"></div>
    <p class="dyn-note" id="f-status" role="status" aria-live="polite"></p>
    <button class="btn btn-primary" type="submit">Pedir orçamento com ${esc(first)}</button>
    <p class="dyn-small">Seus dados vão só para ${esc(first)} e a loja ${esc(pro.store?.name ?? '')}. <a href="/politica-de-privacidade.html">Privacidade</a>.</p>
  </form>` : '';
  return `<section class="section section-tint" id="orcamento-projetista" aria-labelledby="h-cta"><div class="container dyn-cta">
    <div><span class="eyebrow">Atendimento direto</span><h2 id="h-cta">Pedir orçamento com ${esc(first)}</h2>
      <p>${esc(first)} recebe seu pedido na hora${pro.response_minutes != null ? ` e costuma responder em cerca de ${pro.response_minutes < 60 ? `${Math.max(1, pro.response_minutes)} min` : `${Math.round(pro.response_minutes / 60)} h`}` : ''}.</p>
      <div class="dyn-actions">${wa}</div></div>
    ${form}
  </div></section>`;
}

export const ctaScripts = (env) => `${env.TURNSTILE_SITE_KEY ? '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>' : ''}
<script>window.LIVE_API=${JSON.stringify((env.BACKOFFICE_API || 'https://admin.liveambientes.com.br').replace(/\/$/, ''))};</script>
<script src="/js/dinamico.js?v=1" defer></script>`;
