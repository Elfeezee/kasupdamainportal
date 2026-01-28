# 🚀 Master Production Setup Guide (Nginx, PM2, SSL)

This guide provides a step-by-step walkthrough of the entire setup performed on this server to ensure the application runs permanently, securely, and is scalable for future apps.

---

## 1. Environment & Tools Installation

First, we ensure the core runtime and process managers are installed.

### Install Node.js (Version 20)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential
```

### Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### Install Nginx & Certbot (Reverse Proxy & SSL)
```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

---

## 2. Application Setup & PM2 Persistence

### Step A: Build the Application
Run this in your project directory (`/root/kasupdamainportal`):
```bash
npm install
npm run build
```

### Step B: Configure PM2 (`ecosystem.config.js`)
We use an ecosystem file to manage the app settings and port.
```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'kasupda',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: '4500' // Current port set to 4500
      }
    }
  ]
};
```

### Step C: Start & Secure Persistence
This ensures the app restarts on crashes and system reboots.
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup systemd
# NOTE: Run the specific 'sudo env PATH=...' command that the previous command prints!
```

---

## 3. Secret Management (Firebase JSON)

To keep secrets out of the code and environment variables clean:
1. Create a secure folder: `sudo mkdir -p /var/secrets`
2. Save your JSON: `sudo nano /var/secrets/firebase-sa.json`
3. Restrict permissions:
   ```bash
   sudo chown root:root /var/secrets/firebase-sa.json
   sudo chmod 600 /var/secrets/firebase-sa.json
   ```

---

## 4. Nginx Reverse Proxy Configuration

We use Nginx as a "Master Proxy" to route traffic from ports 80 (HTTP) and 443 (HTTPS) to our app.

### Site Configuration (`/etc/nginx/sites-available/kasupda.org`)
```nginx
server {
    listen 80;
    server_name kasupda.org www.kasupda.org;

    location / {
        proxy_pass http://localhost:4500;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Enable the Site
```bash
sudo ln -s /etc/nginx/sites-available/kasupda.org /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default # Remove default Nginx page
sudo nginx -t && sudo systemctl reload nginx
```

---

## 5. SSL Configuration (Domain & IP)

### Valid SSL for Domain (Let's Encrypt)
Run this command and follow the prompts (or use non-interactive flags):
```bash
sudo certbot --nginx -d kasupda.org -d www.kasupda.org
```

### SSL for IP Address (Self-Signed)
Let's Encrypt does not support public IPs, so we create a self-signed certificate for the IP directly.
```bash
sudo mkdir -p /etc/ssl/self-signed
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/self-signed/nginx-selfsigned.key \
  -out /etc/ssl/self-signed/nginx-selfsigned.crt \
  -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=76.13.3.56"
```

Configure the IP fallback in Nginx (`/etc/nginx/sites-available/default-ssl-ip`):
```nginx
server {
    listen 443 ssl default_server;
    server_name _;
    ssl_certificate /etc/ssl/self-signed/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/self-signed/nginx-selfsigned.key;
    
    location / {
        proxy_pass http://localhost:4500; # Routes IP access to your app
    }
}
```

---

## 7. How to Update Your App (Pushing Changes)

Because this is a production environment, changes to your code will **not** reflect immediately. You must rebuild the app.

**Run this command to update the live site:**
```bash
npm run build && pm2 restart kasupda
```

---

## 8. Development vs Production

*   **Production (Live)**: Fast and stable. Requires `npm run build` + `pm2 restart`.
*   **Development**: Slow but shows changes instantly. Run `npm run dev -- -p 4500` to test things live as you type.
