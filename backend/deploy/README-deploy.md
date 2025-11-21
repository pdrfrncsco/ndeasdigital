Deploy notes for ndeascloud (Django backend + Next.js frontend)

Overview
- Backend: Django app served by Gunicorn, proxied via Nginx at api-ndeas.ndeas.cloud
- Frontend: Next.js production server (next start) proxied via Nginx at ndeas.cloud
- SSL: use Certbot (Let's Encrypt) to obtain certificates and enable HTTPS

Server assumptions
- Ubuntu/Debian-like VPS
- Systemd available
- Nginx installed
- Node.js (16+/18+) and npm installed
- Python 3.10+ and virtualenv

Paths used in examples
- Application root: /var/www/ndeascloud
  - Backend: /var/www/ndeascloud/backend
  - Frontend: /var/www/ndeascloud/frontend
  - Virtualenv: /var/www/ndeascloud/venv

Quick deploy steps (commands to run on server)

# 1. Create user and directories
sudo adduser --system --group --no-create-home --shell /usr/sbin/nologin deploy
sudo mkdir -p /var/www/ndeascloud
sudo chown $USER:$USER /var/www/ndeascloud

# 2. Clone repo and install backend deps
cd /var/www/ndeascloud
git clone <your-repo-url> .
python3 -m venv venv
source venv/bin/activate
pip install -U pip
pip install -r backend/requirements.txt

# 3. Configure env files
# Copy provided example to /var/www/ndeascloud/backend/.env and edit values
sudo cp backend/systemd/ndeascloud.env.example /var/www/ndeascloud/backend/.env
# Edit .env, set DJANGO_SECRET, SMTP credentials, ALLOWED_HOSTS, etc.

# 4. Migrate, collectstatic
cd backend
source ../venv/bin/activate
python manage.py migrate
python manage.py collectstatic --noinput

# 5. Configure Gunicorn systemd (examples provided)
# Copy example units to /etc/systemd/system/ and customize paths
sudo cp backend/systemd/gunicorn.socket.example /etc/systemd/system/gunicorn.socket
sudo cp backend/systemd/gunicorn.service.example /etc/systemd/system/gunicorn.service
sudo systemctl daemon-reload
sudo systemctl enable --now gunicorn.socket
sudo systemctl status gunicorn.socket

# 6. Install and build frontend
cd /var/www/ndeasvloud/frontend
npm install
npm run build
# Start Next.js via systemd unit (example provided)
sudo cp frontend/systemd/next.service.example /etc/systemd/system/ndeas-next.service
sudo systemctl daemon-reload
sudo systemctl enable --now ndeas-next.service
sudo systemctl status ndeas-next.service

# 7. Configure Nginx
sudo cp deploy/nginx/api-ndeas.ndeas.cloud.conf.example /etc/nginx/sites-available/api-ndeas.ndeas.cloud
sudo cp deploy/nginx/ndeas.cloud.conf.example /etc/nginx/sites-available/ndeas.cloud
sudo ln -s /etc/nginx/sites-available/api-ndeas.ndeas.cloud /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/ndeas.cloud /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 8. Obtain TLS certificates with certbot (nginx plugin)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ndeas.cloud -d www.ndeas.cloud
sudo certbot --nginx -d api-ndeas.ndeas.cloud

# 9. Firewall (ufw) example
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

Troubleshooting notes
- If Gunicorn cannot bind to socket, check socket path and permissions (/run/gunicorn/)
- Check logs:
  - systemctl status gunicorn.service
  - journalctl -u gunicorn.service -f
  - /var/www/ndeasvloud/backend/tmp/email_errors.log (email/telemetry)
  - nginx error log: /var/log/nginx/error.log

Optional improvements
- Use `supervisor` or `pm2` for Node process management (alternative to systemd)
- Use a process to reattempt delivery of `tmp/failed_email_*.json` items
- Persist invoices in DB and build an admin UI for re-sending

