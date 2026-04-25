VPS Deployment Playbook
Personal cheatsheet for deploying Hono/Node APIs to a Hostinger VPS for sale on RapidAPI. Based on AddressFormat API migration (Render → VPS, April 2026).
> If you do this once, it takes 4 hours. If you've done it before, it takes 60 minutes. This document is so the second time takes 30.
---
Mental model
```
Customer
   │  HTTPS
   ▼
RapidAPI gateway (Frankfurt)
   │  HTTP + X-RapidAPI-Proxy-Secret header
   ▼
nginx on VPS (port 80)
   │  HTTP local
   ▼
Node app via PM2 (port 3000)
```
The proxy secret is the only thing stopping someone who finds your VPS IP from bypassing RapidAPI billing. Take it seriously.
---
Phase 0 — Prep
[ ] Code works locally (`npm run dev`, tests green)
[ ] Pushed to a public GitHub repo
[ ] Hostinger account exists
[ ] Windows Terminal or PowerShell (SSH built in on Windows 10+)
---
Phase 1 — Order VPS (5 min)
Plan: KVM 1 (~€7/mo, 1 month to start)
OS: Ubuntu 24.04 LTS
Region: Frankfurt (matches RapidAPI EU gateway)
Panel: none (skip CloudPanel, hPanel etc. for APIs)
SSH key: yes, generate locally first:
```powershell
  ssh-keygen -t ed25519 -C "you@email.com"
  type $env:USERPROFILE\.ssh\id_ed25519.pub
  ```
Paste the output into Hostinger's SSH key field.
Skip: backups, malware scanner, Docker manager.
You get back: a public IP. Save it.
---
Phase 2 — Server hardening (10 min)
```bash
ssh root@VPS_IP

apt update && apt upgrade -y

apt install ufw -y
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable     # answer y when warned about SSH
ufw status     # verify
```
---
Phase 3 — Runtime install (5 min)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install nodejs git -y
npm install -g pm2

node --version    # v20.x
npm --version     # 10.x
git --version
pm2 --version
```
---
Phase 4 — Clone + run app (10 min)
```bash
cd /root
git clone https://github.com/YOUR_USER/YOUR_REPO.git
cd YOUR_REPO
npm install
npm run build     # if you have one
npm test          # if you have tests
```
Manual start to verify:
```bash
npm start
# Should print: API listening on http://localhost:3000
```
In a second SSH window:
```bash
curl http://localhost:3000/health
```
If green, kill the manual start (Ctrl+C) and continue with PM2.
---
Phase 5 — PM2 (5 min)
Use a placeholder secret first — replace with the real RapidAPI one in Phase 7.
```bash
RAPIDAPI_PROXY_SECRET=placeholder pm2 start npm --name YOUR_APP -- start
pm2 status
pm2 logs YOUR_APP --lines 10    # confirm "ENABLED"

pm2 startup systemd
# Copy and run the line PM2 prints
pm2 save
```
After this, the app will auto-restart on crash AND auto-start on reboot.
---
Phase 6 — nginx reverse proxy (10 min)
```bash
apt install nginx -y
rm -f /etc/nginx/sites-enabled/default
nano /etc/nginx/sites-available/YOUR_APP
```
Paste (replace `YOUR_APP` and adjust port if not 3000):
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name _;

    client_max_body_size 2M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass_request_headers on;
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
}
```
`Ctrl+O`, `Enter`, `Ctrl+X`.
```bash
ln -s /etc/nginx/sites-available/YOUR_APP /etc/nginx/sites-enabled/
nginx -t                       # must say "syntax is ok"
systemctl reload nginx
```
Test from your laptop browser: `http://VPS_IP/health` → JSON response.
---
Phase 7 — RapidAPI wiring (15 min)
Provider dashboard → Add New API → fill in basics.
General tab → Base URL: `http://VPS_IP` (note `http://`, not `https://`).
General tab → Health Check URL: `http://VPS_IP/health` (NOT `/ping` — that's a common trap).
Gateway tab → Firewall Settings → copy the auto-generated proxy secret (UUID-like string).
SSH back into VPS and replace placeholder:
```bash
   pm2 delete YOUR_APP
   cd /root/YOUR_REPO
   RAPIDAPI_PROXY_SECRET=THE_REAL_SECRET pm2 start npm --name YOUR_APP -- start
   pm2 save
   pm2 logs YOUR_APP --lines 5    # confirm ENABLED
   ```
Definitions → add each endpoint with method, path, body example, generate schema.
Definitions → playground test each endpoint. Headers should show `server: nginx/...`, NOT a hosting-platform-specific header.
Monetize → set 4 pricing tiers.
Docs → fill in long description.
Visibility → Public, Publish.
---
Lessons from migration
Architecture choices that worked
Hono over Express: smaller, faster, native TypeScript, identical mental model. No regret.
Zod schemas: validation + TS types in one go.
Proxy secret check as middleware on `/v1/*`: keeps `/` and `/health` public for monitoring.
CORS middleware from day one with `c.body(null, 204)` for OPTIONS (NOT `c.text('', 204)` — that returns an empty string body that breaks some clients).
RapidAPI gotchas
The Proxy Secret is generated by RapidAPI, you can't type your own. Find it under Gateway → Firewall Settings (NOT Definitions → Security — that's customer-facing OAuth, separate thing).
Path parameters use `{code}` (curly braces), not Express-style `:code`.
"Generate schema" button in each endpoint definition — always click it after entering a body example. Saves manual JSON-schema typing.
"Valid example" green checkmark must show before you Save an endpoint definition.
Visibility stays Private while you test; Public is the very last action.
Default rate limit on your own API is 500,000 free requests/month from RapidAPI — separate from what your customers see.
Hostinger VPS specifics
Free tier? No. VPS is paid (~€7/mo) but always warm. Worth it over any free PaaS for a paid product.
Disk usage starts at ~3 GB (Ubuntu base + Node + nginx + tools). Normal. Not a problem on 50 GB.
No render.yaml or platform-specific config files needed. Pure Node, pure nginx.
Apt may show "Pending kernel upgrade" after updates. Defer reboots to a quiet moment, then `reboot` — PM2 startup script will auto-restore your app.
Workflow lessons
Naming consistency from day one: pick `recipient` or `recipient_name`, then use it EVERYWHERE — Zod schema, README, tests, RapidAPI body examples. Inconsistencies cost you customers (default body example fails → they leave).
Saved Body examples in RapidAPI MUST match the schema, otherwise the default test fails and prospects bounce.
Test all endpoints in the playground before publish — the entire chain (RapidAPI → proxy secret → nginx → PM2 → Node) must be green.
Keep a `RAPIDAPI.md` in every repo with what you learned shipping that specific API. The patterns transfer; the per-API details don't.
Security gotchas
Don't paste API keys / secrets in chats with anyone (including AI assistants). Regenerate after exposure — gratis on RapidAPI, costly when leaked.
Public endpoints (`/`, `/health`) should be OUTSIDE the proxy-secret middleware so RapidAPI's daily health check can hit them anonymously.
The middleware order matters: CORS first, then proxy-secret check on `/v1/*` only.
---
Daily ops cheatsheet
```bash
# Status check
pm2 status
pm2 logs YOUR_APP --lines 50
df -h /
free -h

# Deploy update
cd /root/YOUR_REPO
git pull
npm install         # if dependencies changed
pm2 restart YOUR_APP

# Reset everything
pm2 delete YOUR_APP
RAPIDAPI_PROXY_SECRET=xxx pm2 start npm --name YOUR_APP -- start
pm2 save

# Disk cleanup (run quarterly)
apt clean
apt autoremove -y
journalctl --vacuum-time=7d

# nginx
nginx -t                       # test config
systemctl reload nginx         # apply config without dropping connections
systemctl status nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```
---
When to scale up
Signal	Action
One subscriber repeatedly hits limits	Lower BASIC quota, push them to PRO
CPU sustained >80% for an hour	Upgrade to KVM 2 (~€10/mo)
Disk over 30 GB on KVM 1	Cleanup; if growing fast, investigate logs
Latency from RapidAPI > 200ms consistent	Check `pm2 logs` for slow handlers
Need HTTPS on your own domain	Buy domain, point A-record to VPS, certbot
---
Adding HTTPS later (when you have a domain)
When you outgrow the raw IP:
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d api.yourdomain.com
# Cert auto-renews via systemd timer
```
Then update RapidAPI Base URL from `http://VPS_IP` to `https://api.yourdomain.com`.
