PM2 deployment quick steps

1) Prepare secrets (do this on the VPS, do NOT commit the JSON):

sudo mkdir -p /var/secrets
sudo tee /var/secrets/firebase-sa.json > /dev/null <<'JSON'
<paste the JSON from your .env.local here>
JSON
sudo chown root:root /var/secrets/firebase-sa.json
sudo chmod 600 /var/secrets/firebase-sa.json

2) Build and start with PM2 (run in project dir):

npm ci
npm run build
pm2 start ecosystem.config.js --env production
pm2 save

3) Make PM2 start on system boot:

# run the command printed by this; example output is shown, but you must run the command printed for your user
pm2 startup systemd
# follow the printed command (it will be something like: sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u youruser --hp /home/youruser)

4) Useful pm2 commands:

pm2 status
pm2 logs kasupda --lines 200
pm2 restart kasupda
pm2 stop kasupda
pm2 delete kasupda

5) Remove inlined secret from repo (recommended):

# edit .env.local and remove the large JSON, or replace it with:
# GOOGLE_APPLICATION_CREDENTIALS=/var/secrets/firebase-sa.json
# Then ensure you don't commit the JSON, e.g.:
# git rm --cached .env.local
# Add .env.local to .gitignore if not already ignored

If you want, I can move the JSON out of `.env.local` into `/var/secrets/` for you and edit `.env.local` to the safe pointer (requires sudo).
