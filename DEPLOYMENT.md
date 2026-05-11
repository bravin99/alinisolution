# Alini Solutions — Deployment Guide
# CyberPanel · MySQL · Next.js · PM2
# ============================================================

## 1. SERVER PREREQUISITES (run as root or sudo)

```bash
# Install Node.js 20 LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Verify
node -v   # should be v20.x
npm -v

# Install PM2 globally
npm install -g pm2

# Create log directory
mkdir -p /var/log/pm2
```

---

## 2. CYBERPANEL — CREATE WEBSITE & DATABASE

### In CyberPanel UI:
1. **Websites → Create Website**
   - Domain: `alinisolution.co.ke`
   - PHP: select any (Next.js doesn't use PHP)
   - SSL: Enable Let's Encrypt

2. **Databases → Create Database**
   - DB Name:  `alini_web`
   - DB User:  `alini_user`
   - Password: (generate a strong one — save it!)
   - Click "Create Database"

3. **Grant privileges** (in CyberPanel terminal or phpMyAdmin):
   ```sql
   GRANT ALL PRIVILEGES ON alini_web.* TO 'alini_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

## 3. RUN THE DATABASE SCHEMA

```bash
# Import the schema (creates all tables + seed data)
mysql -u alini_user -p alini_web < /path/to/alini-web/sql/schema.sql

# Verify tables were created
mysql -u alini_user -p alini_web -e "SHOW TABLES;"
```

**Change the default admin password immediately:**
```bash
# Generate a new bcrypt hash for your chosen password
node -e "const b=require('bcryptjs'); b.hash('YourNewPassword!', 12).then(console.log)"

# Update in MySQL
mysql -u alini_user -p alini_web -e \
  "UPDATE admin_users SET password_hash='PASTE_HASH_HERE' WHERE email='admin@alinisolution.co.ke';"
```

---

## 4. DEPLOY THE NEXT.JS APP

```bash
# Clone or upload your project
cd /home/alini
git clone https://github.com/your-org/alini-web.git   # or upload via SFTP
cd alini-web

# Copy and fill in your environment variables
cp .env.example .env.local
nano .env.local   # fill in DB_PASSWORD, JWT_SECRET, SMTP_PASS, etc.

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Paste the output as JWT_SECRET in .env.local

# Install dependencies
npm install --production=false

# Build the app
npm run build

# Verify the build output
ls .next/
```

---

## 5. START WITH PM2

```bash
# Update cwd in ecosystem.config.js to your actual path
nano ecosystem.config.js   # change cwd to /home/alini/alini-web

# Start the app
pm2 start ecosystem.config.js --env production

# Check status
pm2 status
pm2 logs alini-web

# Save PM2 process list so it restarts after reboots
pm2 save

# Set PM2 to auto-start on server reboot
pm2 startup
# Run the command it outputs (e.g. sudo env PATH=... pm2 startup systemd ...)
```

---

## 6. CYBERPANEL — NGINX REVERSE PROXY

In CyberPanel, go to **Websites → your site → Rewrite Rules** and add:

```nginx
# Proxy all requests to Next.js running on port 3000
location / {
    proxy_pass         http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header   Upgrade          $http_upgrade;
    proxy_set_header   Connection       'upgrade';
    proxy_set_header   Host             $host;
    proxy_set_header   X-Real-IP        $remote_addr;
    proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

Alternatively, via SSH:
```bash
nano /usr/local/lsws/conf/vhosts/alinisolution.co.ke/vhconf.conf
# or edit the nginx config in /etc/nginx/sites-available/
```

---

## 7. VERIFY EVERYTHING

```bash
# Check Next.js is running
pm2 status
curl http://localhost:3000

# Check the site is accessible
curl https://alinisolution.co.ke

# Check admin login
# Visit: https://alinisolution.co.ke/admin/login
# Email: admin@alinisolution.co.ke
# Password: (the one you set in step 3)

# View PM2 logs in real time
pm2 logs alini-web --lines 50
```

---

## 8. DEPLOYMENT UPDATES (future releases)

```bash
cd /home/alini/alini-web

# Pull latest code
git pull

# Install any new dependencies
npm install

# Rebuild
npm run build

# Reload with zero downtime (cluster mode)
pm2 reload alini-web

# Check logs for errors
pm2 logs alini-web --lines 20
```

---

## 9. USEFUL PM2 COMMANDS

```bash
pm2 status                 # All processes
pm2 logs alini-web         # Live logs
pm2 restart alini-web      # Restart
pm2 reload alini-web       # Zero-downtime reload
pm2 stop alini-web         # Stop
pm2 delete alini-web       # Remove from PM2
pm2 monit                  # Real-time CPU/RAM monitor
```

---

## 10. ADMIN PANEL URLS

| Page            | URL                                       |
|-----------------|-------------------------------------------|
| Login           | https://alinisolution.co.ke/admin/login   |
| Dashboard       | https://alinisolution.co.ke/admin         |
| Leads           | https://alinisolution.co.ke/admin/leads   |
| Pricing Editor  | https://alinisolution.co.ke/admin/pricing |
| Content Editor  | https://alinisolution.co.ke/admin/content |

---

## SECURITY NOTES

- Change the default admin password immediately after first login
- Set a strong `JWT_SECRET` (64+ random bytes)  
- Keep `.env.local` out of git (it's in `.gitignore`)
- CyberPanel firewall: only open ports 80, 443, 22 (and 3000 locally only)
- Consider rate-limiting `/api/contact` and `/api/auth` via nginx
