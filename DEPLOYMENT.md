# Deploying KASUPDA Portal to VPS

This guide will help you deploy your Next.js application to a VPS server using GitHub and SSH.

## Prerequisites

- A VPS server (Ubuntu 20.04/22.04 recommended)
- SSH access to your VPS
- A GitHub account
- Domain name (optional, but recommended)

---

## Step 1: Push Your Code to GitHub

### 1.1 Initialize Git Repository (if not already done)

```bash
cd "c:\Users\El_feezee\kasupda portal\kasupdamainportal"
git init
git add .
git commit -m "Initial commit"
```

### 1.2 Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `kasupdamainportal` (or your preferred name)
3. **Do NOT initialize with README** (since you already have code)

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/kasupdamainportal.git
git branch -M main
git push -u origin main
```

**Important:** Create a `.gitignore` file to exclude sensitive files:

```
# .gitignore
node_modules/
.next/
.env
.env.local
.vercel
```

---

## Step 2: Prepare Your VPS Server

### 2.1 SSH into Your VPS

```bash
ssh username@your-vps-ip
```

### 2.2 Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
```

### 2.3 Install Node.js (v18 or v20 recommended)

```bash
# Using NodeSource repository for Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v
npm -v
```

### 2.4 Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

### 2.5 Install Git

```bash
sudo apt install -y git
```

---

## Step 3: Clone Your Repository on VPS

### 3.1 Generate SSH Key on VPS (if you want to use SSH for GitHub)

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
# Press Enter to accept default location
# Press Enter twice for no passphrase (or set one if you prefer)

# Copy the public key
cat ~/.ssh/id_ed25519.pub
```

### 3.2 Add SSH Key to GitHub

1. Copy the output from the `cat` command above
2. Go to GitHub → Settings → SSH and GPG keys → New SSH key
3. Paste your key and save

### 3.3 Clone the Repository

```bash
# Create a directory for your apps
mkdir -p ~/apps
cd ~/apps

# Clone your repository
git clone git@github.com:YOUR_USERNAME/kasupdamainportal.git
# OR if using HTTPS:
# git clone https://github.com/YOUR_USERNAME/kasupdamainportal.git

cd kasupdamainportal
```

---

## Step 4: Configure Environment Variables

### 4.1 Create `.env.local` File on VPS

```bash
nano .env.local
```

### 4.2 Add Your Environment Variables

Paste your environment variables (get them from your local `.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Save and exit:** Press `Ctrl + X`, then `Y`, then `Enter`

---

## Step 5: Build and Run the Application

### 5.1 Install Dependencies

```bash
npm install
```

### 5.2 Build the Next.js App

```bash
npm run build
```

### 5.3 Start with PM2

```bash
# Start the app with PM2
pm2 start npm --name "kasupda-portal" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on server reboot
pm2 startup
# Follow the command it outputs (usually needs sudo)
```

### 5.4 Check Application Status

```bash
pm2 status
pm2 logs kasupda-portal
```

Your app should now be running on `http://your-vps-ip:3000`

---

## Step 6: Setup Nginx Reverse Proxy (Recommended)

### 6.1 Install Nginx

```bash
sudo apt install -y nginx
```

### 6.2 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/kasupda-portal
```

### 6.3 Add This Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain

    location / {
        proxy_pass http://localhost:3000;
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

### 6.4 Enable the Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/kasupda-portal /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## Step 7: Setup SSL with Let's Encrypt (Recommended)

### 7.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 7.2 Obtain SSL Certificate

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Follow the prompts. Certbot will automatically configure Nginx for HTTPS.

### 7.3 Auto-Renewal

Certbot sets up auto-renewal automatically. Test it with:

```bash
sudo certbot renew --dry-run
```

---

## Step 8: Deploy Updates (Future Deployments)

Create a deployment script for easy updates:

### 8.1 Create Deploy Script

```bash
nano ~/apps/kasupdamainportal/deploy.sh
```

### 8.2 Add This Content

```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Navigate to app directory
cd ~/apps/kasupdamainportal

# Pull latest changes
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build application
echo "🔨 Building application..."
npm run build

# Restart PM2
echo "♻️  Restarting application..."
pm2 restart kasupda-portal

echo "✅ Deployment complete!"
```

### 8.3 Make Script Executable

```bash
chmod +x ~/apps/kasupdamainportal/deploy.sh
```

### 8.4 Run Deployments

```bash
cd ~/apps/kasupdamainportal
./deploy.sh
```

---

## Step 9: Setup Firewall (Security)

### 9.1 Configure UFW Firewall

```bash
# Allow SSH
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## Useful PM2 Commands

```bash
# View app status
pm2 status

# View logs
pm2 logs kasupda-portal

# View logs in real-time
pm2 logs kasupda-portal --lines 100

# Restart app
pm2 restart kasupda-portal

# Stop app
pm2 stop kasupda-portal

# Delete app from PM2
pm2 delete kasupda-portal

# Monitor resource usage
pm2 monit
```

---

## Troubleshooting

### App Not Starting

```bash
# Check logs
pm2 logs kasupda-portal

# Check if port 3000 is in use
sudo lsof -i :3000

# Restart PM2
pm2 restart kasupda-portal
```

### Can't Access via Domain

```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test Nginx config
sudo nginx -t
```

### Database Connection Issues

- Ensure your `.env.local` has correct Supabase credentials
- Check if Supabase allows connections from your VPS IP

---

## Performance Optimization

### Enable PM2 Cluster Mode (for multi-core servers)

```bash
pm2 delete kasupda-portal
pm2 start npm --name "kasupda-portal" -i max -- start
pm2 save
```

This will run multiple instances of your app across all CPU cores.

---

## Monitoring

### Setup PM2 Plus (Optional - Free Tier Available)

1. Go to [PM2.io](https://pm2.io/)
2. Create account and get your key
3. Link your server:

```bash
pm2 link YOUR_SECRET_KEY YOUR_PUBLIC_KEY
```

This gives you web-based monitoring, logs, and alerts.

---

## Summary

Your deployment workflow:

1. **Make changes locally** → Commit → Push to GitHub
2. **SSH to VPS** → Run `./deploy.sh`
3. **Done!** Your site is updated

**Your app is now live at:**
- `http://your-vps-ip:3000` (direct access)
- `http://your-domain.com` (via Nginx)
- `https://your-domain.com` (with SSL)

---

## Next Steps

1. Setup GitHub Actions for automatic deployments (CI/CD)
2. Configure database backups
3. Setup monitoring and alerting
4. Implement rate limiting and security headers

For issues or questions during deployment, check the logs and error messages carefully.
