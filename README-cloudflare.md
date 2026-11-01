# Cloudflare Pages

`functions/send-form.php.js` handles `POST /send-form.php` (same behavior as `send-form.php`), sending mail via Resend.

Environment variables (set in Pages → Settings → Variables and Secrets):

- `RESEND_API_KEY` (secret) — Resend API key.
- `MAIL_FROM` — sender, e.g. `Site Live Ambientes <no-reply@liveambientes.com.br>` (domain must be verified in Resend).
- `TEST_RECIPIENT` (optional) — if set, all form e-mails go to this address instead of the stores.
