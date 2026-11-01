// Cloudflare Pages Function replicating send-form.php (POST /send-form.php).
// Env: RESEND_API_KEY, MAIL_FROM, optional TEST_RECIPIENT, BACKOFFICE_URL, BACKOFFICE_INGEST_TOKEN.

const LOJA_EMAILS = {
  'Recreio': 'recreio@liveambientes.com.br',
  'Tijuca': 'gerencia@grupomoveisflexx.com',
  'Niterói': 'gerencia@grupomoveisflexx.com',
};
const ALL_EMAILS = [...new Set(Object.values(LOJA_EMAILS))];

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

const cleanHeaderField = (v) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim();
const isValidEmail = (v) => /^[^\s@<>(),;:"\[\]\\]+@[^\s@<>(),;:"\[\]\\]+\.[^\s@<>(),;:"\[\]\\]+$/.test(v);

function toBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin);
}

const STORE_SLUGS = { recreio: 'recreio', tijuca: 'tijuca', niteroi: 'niteroi' };
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const KNOWN_FIELDS = new Set(['form_type', 'nome', 'telefone', 'email', 'loja', 'mensagem', 'detalhes', 'comodos[]', 'comodos', 'planta', ...UTM_KEYS]);

const normalize = (v) => String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

async function sendToBackoffice(env, lead) {
  if (!env.BACKOFFICE_INGEST_TOKEN) return;
  try {
    const base = env.BACKOFFICE_URL || 'https://liveambientes-backoffice.liveambientes.workers.dev';
    const res = await fetch(`${base}/api/leads/ingest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.BACKOFFICE_INGEST_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.log(`backoffice ingest failed: ${res.status}`);
  } catch (e) {
    console.log(`backoffice ingest failed: ${e?.name || 'error'}`);
  }
}

function buildLead({ form, request, formType, nome, email, telefone, loja, mensagem, detalhes, comodos }) {
  const lines = [];
  if (formType === 'orcamento') {
    if (comodos.length) lines.push(`Cômodos de interesse: ${comodos.map(cleanHeaderField).join(', ')}`);
    if (detalhes) lines.push(detalhes);
  } else if (mensagem) {
    lines.push(mensagem);
  }
  for (const [k, v] of form.entries()) {
    if (KNOWN_FIELDS.has(k) || typeof v !== 'string' || v.trim() === '') continue;
    lines.push(`${k}: ${v.trim()}`);
  }

  const lead = {
    external_id: `site-${crypto.randomUUID()}`,
    name: nome,
    email,
    phone: telefone,
    message: lines.join('\n'),
    source: 'site',
  };
  const slug = STORE_SLUGS[normalize(loja)];
  if (slug) lead.store_slug = slug;

  let ref = null;
  try {
    const u = new URL(request.headers.get('Referer') || '');
    if (u.protocol === 'http:' || u.protocol === 'https:') ref = u;
  } catch {}
  if (ref) lead.page_url = ref.href;
  for (const k of UTM_KEYS) {
    const v = form.get(k);
    const val = typeof v === 'string' && v.trim() !== '' ? v.trim() : ref?.searchParams.get(k);
    if (val) lead[k] = val;
  }

  const attachments = [];
  for (const [, v] of form.entries()) {
    if (v && typeof v !== 'string' && v.size > 0) {
      attachments.push({ name: (v.name || 'arquivo').split(/[\\/]/).pop(), size: v.size, type: v.type || 'application/octet-stream' });
    }
  }
  if (attachments.length) lead.attachments = attachments;
  return lead;
}

export async function onRequestPost({ request, env, waitUntil }) {
  let form;
  try {
    form = await request.formData();
  } catch {
    form = new FormData();
  }
  const str = (k) => { const v = form.get(k); return typeof v === 'string' ? v : ''; };

  const formType = cleanHeaderField(str('form_type'));
  const nome = cleanHeaderField(str('nome'));
  const telefone = cleanHeaderField(str('telefone'));
  const email = cleanHeaderField(str('email'));
  const loja = cleanHeaderField(str('loja'));
  const mensagem = str('mensagem').trim();
  const detalhes = str('detalhes').trim();
  const comodos = [...form.getAll('comodos[]'), ...form.getAll('comodos')]
    .filter((v) => typeof v === 'string');

  if (email !== '' && !isValidEmail(email)) {
    return json({ ok: false, error: 'E-mail inválido' }, 400);
  }

  let to, subject, body;
  switch (formType) {
    case 'orcamento':
      if (nome === '' || telefone === '' || email === '' || loja === '') {
        return json({ ok: false, error: 'Campos obrigatórios faltando' }, 400);
      }
      to = LOJA_EMAILS[loja] ? [LOJA_EMAILS[loja]] : ALL_EMAILS;
      subject = `Novo orçamento pelo site — Loja ${loja}`;
      body = `Nome: ${nome}\n`;
      body += `Telefone/WhatsApp: ${telefone}\n`;
      body += `E-mail: ${email}\n`;
      body += `Loja: ${loja}\n`;
      body += `Cômodos de interesse: ${comodos.map(cleanHeaderField).join(', ')}\n\n`;
      body += `Detalhes do projeto:\n${detalhes}\n`;
      break;

    case 'contato':
      if (nome === '' || telefone === '') {
        return json({ ok: false, error: 'Campos obrigatórios faltando' }, 400);
      }
      to = [LOJA_EMAILS['Recreio']];
      subject = 'Nova mensagem de contato pelo site';
      body = `Nome: ${nome}\n`;
      body += `Telefone/WhatsApp: ${telefone}\n`;
      body += `E-mail: ${email}\n\n`;
      body += `Mensagem:\n${mensagem}\n`;
      break;

    case 'newsletter':
      if (email === '') {
        return json({ ok: false, error: 'E-mail obrigatório' }, 400);
      }
      to = [LOJA_EMAILS['Recreio']];
      subject = 'Nova inscrição na newsletter pelo site';
      body = `E-mail inscrito: ${email}\n`;
      break;

    default:
      return json({ ok: false, error: 'Tipo de formulário inválido' }, 400);
  }

  if (env.TEST_RECIPIENT) to = [env.TEST_RECIPIENT];

  const payload = { from: env.MAIL_FROM, to, subject, text: body };
  if (email !== '') payload.reply_to = email;

  const planta = form.get('planta');
  if (formType === 'orcamento' && planta && typeof planta !== 'string' && planta.size > 0) {
    const filename = (planta.name || 'planta').split(/[\\/]/).pop();
    payload.attachments = [{
      filename,
      content: toBase64(await planta.arrayBuffer()),
      content_type: planta.type || 'application/octet-stream',
    }];
  }

  let ok = false;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    ok = res.ok;
  } catch {
    ok = false;
  }

  if (formType === 'orcamento' || formType === 'contato') {
    try {
      const lead = buildLead({ form, request, formType, nome, email, telefone, loja, mensagem, detalhes, comodos });
      waitUntil(sendToBackoffice(env, lead));
    } catch (e) {
      console.log(`backoffice ingest failed: ${e?.name || 'error'}`);
    }
  }

  return json({ ok });
}

export function onRequest() {
  return json({ ok: false, error: 'Method not allowed' }, 405);
}
