# Cloudflare Pages

`functions/send-form.php.js` handles `POST /send-form.php` (same behavior as `send-form.php`), sending mail via Resend.

Environment variables (set in Pages → Settings → Variables and Secrets):

- `RESEND_API_KEY` (secret) — Resend API key.
- `MAIL_FROM` — sender, e.g. `Site Live Ambientes <no-reply@liveambientes.com.br>` (domain must be verified in Resend).
- `TEST_RECIPIENT` (optional) — if set, all form e-mails go to this address instead of the stores.

## Páginas dinâmicas (dez/2026)

Pages Functions com SSR, lendo a API pública do backoffice (`https://admin.liveambientes.com.br`):

| Rota | Arquivo | Conteúdo |
|---|---|---|
| `/blog`, `/blog?tag=`, `/blog/<slug>`, `/blog/autor/<slug>` | `functions/blog/[[path]].js` | lista paginada, post (`BlogPosting`), artigos do autor (`Person`) |
| `/projetistas`, `/projetistas/<slug>` | `functions/projetistas/[[path]].js` | lista e perfil: status, tempo de resposta, pastas e projetos, depoimentos, artigos, CTA (`Person`) |
| `/projetos/<slug>` | `functions/projetos/[[path]].js` | landing por blocos (planta no topo), CTA "Pedir orçamento com <nome>" e "Conversar no WhatsApp" (`CreativeWork`). Arquivos estáticos (`projetos/marina-paiva.html`) continuam servidos como antes. |
| `/sitemap.xml` | `functions/sitemap.xml.js` | páginas fixas + posts + projetistas + projetos |

`_routes.json` limita as Functions a essas rotas (o resto continua estático, sem custo de Function).
Estilos em `css/dinamico.css` (tokens semânticos e de componente sobre os primitivos de `style.css`), script em `js/dinamico.js`.

Variáveis (Pages → Settings → Variables):
- `BACKOFFICE_API` (opcional): base da API. Padrão `https://admin.liveambientes.com.br`.
- `TURNSTILE_SITE_KEY`: *site key* do widget Turnstile (o *secret* fica no backoffice como `TURNSTILE_SECRET`). Sem ela o formulário não aparece e o CTA fica só no WhatsApp.
- `BACKOFFICE_TEST=1`: **só local**, inclui dados de teste.

Teste local (backoffice rodando em `localhost:8787`):
```sh
npx wrangler pages dev . --port 8788 --binding BACKOFFICE_API=http://localhost:8787 --binding BACKOFFICE_TEST=1
```
Em produção o formulário envia para `POST /api/public/leads/request` (CORS liberado só para `liveambientes.com.br`); localmente o navegador bloqueia por CORS, o que é esperado.
