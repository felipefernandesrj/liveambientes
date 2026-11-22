// Páginas dinâmicas: pedido de orçamento com Turnstile e registro do clique no WhatsApp.
(function () {
  var API = window.LIVE_API || 'https://admin.liveambientes.com.br';
  // WhatsApp: registra o clique (sem dados pessoais) e segue o link normalmente.
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.addEventListener('click', function () {
      try {
        fetch(API + '/api/public/track/whatsapp', { method: 'POST', keepalive: true, headers: { 'content-type': 'text/plain' },
          body: JSON.stringify({ projetista_slug: a.dataset.pro, item_slug: a.dataset.item || null }) });
      } catch (e) {}
    });
  });
  var f = document.getElementById('pedido');
  if (!f) return;
  var st = document.getElementById('f-status');
  var say = function (t, cls) { st.textContent = t; st.className = 'dyn-note ' + (cls || ''); };
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = f.elements.name, phone = f.elements.phone;
    [name, phone].forEach(function (i) { i.setAttribute('aria-invalid', String(!i.value.trim())); });
    if (!name.value.trim()) { say('Informe seu nome.', 'err'); name.focus(); return; }
    if (phone.value.replace(/\D/g, '').length < 10) { phone.setAttribute('aria-invalid', 'true'); say('Informe o WhatsApp com DDD.', 'err'); phone.focus(); return; }
    var tok = (f.querySelector('[name="cf-turnstile-response"]') || {}).value || '';
    if (!tok) { say('Aguarde a verificação de segurança e tente de novo.', 'err'); return; }
    var btn = f.querySelector('button[type=submit]'); btn.disabled = true; say('Enviando…');
    var u = new URLSearchParams(location.search);
    fetch(API + '/api/public/leads/request', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({
      projetista_slug: f.dataset.pro, item_slug: f.dataset.item || null, name: name.value, phone: phone.value, email: f.elements.email.value || null,
      message: f.elements.message.value || null, turnstile_token: tok, page_url: location.href,
      utm_source: u.get('utm_source'), utm_medium: u.get('utm_medium'), utm_campaign: u.get('utm_campaign') }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        if (x.ok) { f.reset(); say('Pedido enviado! Você será contatado em breve.', 'ok'); }
        else { say(x.d.detail || 'Não foi possível enviar. Tente pelo WhatsApp.', 'err'); btn.disabled = false; }
        if (window.turnstile) window.turnstile.reset();
      })
      .catch(function () { say('Sem conexão. Tente de novo.', 'err'); btn.disabled = false; });
  });
})();
