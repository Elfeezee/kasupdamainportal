# Running Kasupda on a VPS with PM2 🚀

This document contains the essential steps and commands to run the Next.js application permanently using PM2 on a VPS (systemd-based Linux).

---

## Pre-reqs ✅
- Node.js (recommended: Node 20+)
- npm
- PM2 (`npm install -g pm2`)
- A user with sudo privileges to create secure secret files and enable system services

---

## 1) Project setup

```bash
# clone / upload the project to your VPS
cd /var/www/kasupdamainportal
# install deps
npm ci
# build the Next.js app
npm run build
```

Notes:
- Use a non-root user if possible. This README assumes you can run commands as the deploy user or with sudo as needed.

---

## 2) Prepare secrets (VERY IMPORTANT)
Store sensitive JSON (e.g., Firebase service account) outside the repository and restrict access:

```bash
sudo mkdir -p /var/secrets
sudo tee /var/secrets/firebase-sa.json > /dev/null <<'JSON'
<paste your firebase JSON here>
JSON
sudo chown root:root /var/secrets/firebase-sa.json
sudo chmod 600 /var/secrets/firebase-sa.json
```

Then set the environment variable to point to the file (example placed in PM2 ecosystem or `.env.production`):

```
GOOGLE_APPLICATION_CREDENTIALS=/var/secrets/firebase-sa.json
```

---

## 3) PM2 ecosystem (example provided in repo)
We keep an `ecosystem.config.js` in the repo. Start the app with the production environment:

```bash
pm2 start ecosystem.config.js --env production
pm2 save
```

Key PM2 commands:
- `pm2 status` — show running processes
- `pm2 logs kasupda --lines 200` — view logs for the `kasupda` app
- `pm2 restart kasupda` — restart the app
- `pm2 stop kasupda` — stop the app
- `pm2 delete kasupda` — remove the process from PM2

Make PM2 boot on system restart (run the printed command that follows):

```bash
pm2 startup systemd
# Then run the command printed by the previous command with sudo
pm2 save
```

---

## 4) Verify the app
- Check the Next.js output in PM2 logs: `pm2 logs kasupda --lines 200` (it should show something like "Local: http://localhost:3000" and "Ready in ...").
- Visit your server on the app port (e.g., `http://your-server-ip:3000`) to confirm the app serves pages.

---

## 5) Optional: Upgrade Node
If you see deprecation warnings (e.g., from Supabase) consider upgrading to Node 20+:

```bash
# Example for Debian/Ubuntu
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential
```

---

## 6) Recommended: Add Nginx reverse proxy & HTTPS
Use Nginx to serve on ports 80/443 and proxy to the app port (3000), then use Certbot for Let's Encrypt certificates. Example Nginx server block:

```
server {
  listen 80;
  server_name example.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

Certbot (Let's Encrypt):
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.com
```

---

## 7) Troubleshooting tips
- If the app fails to start, check logs: `pm2 logs kasupda` and Next.js build logs.
- Check environment variables are set and accessible (PM2 uses the environment in `ecosystem.config.js` or the system env).
- Make sure secrets are readable by the process user (the file above is owned by `root` and is mode `600`; if running as non-root, consider placing secrets in a directory that user can access with appropriate permissions).

---

## 8) Quick checklist before production
- [ ] Secrets stored securely and not committed
- [ ] PM2 configured and saved (`pm2 save`)
- [ ] PM2 startup enabled (`pm2 startup` + run printed command)
- [ ] Node version >= 20
- [ ] Nginx + TLS configured (if exposing to the internet)

---

If you want, I can:
- Move the JSON secrets into `/var/secrets` for you and update `.env.local` (requires sudo),
- Upgrade Node to v20, or
- Generate an `nginx` config and Certbot commands for your domain.

