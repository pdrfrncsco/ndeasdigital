# Backend (Django) — Quickstart

This folder contains a minimal Django project with Django REST Framework and simple endpoints to support the Next.js frontend.

Prerequisites:
- Python 3.10+ (or compatible)
- pip

Setup (Windows PowerShell example):

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Available endpoints (dev):
- `POST /api/budget/` — Accepts JSON with form fields and returns a simple estimation JSON.
- `POST /api/contact/` — Accepts contact form JSON and returns confirmation.
- `POST /api/invoice/` — Accepts invoice data (JSON) and returns generated invoice id.

Example `curl` request (budget):

```bash
curl -X POST http://127.0.0.1:8000/api/budget/ -H "Content-Type: application/json" -d '{"name":"Cliente","email":"a@b.com","phone":"+244","system_type":"ecommerce","features":["sms","payment"],"hosting":"basic","domain":"com","support":true }'
```

Notes:
- This is a minimal scaffold for development. Add authentication, validation, persistence, and email sending before production.
# Email configuration (production)
To send emails in production set the following environment variables in your deployment environment (don't commit secrets):

- `EMAIL_BACKEND` (optional): e.g. `django.core.mail.backends.smtp.EmailBackend`. If not set and `DEBUG=False`, settings default to SMTP.
- `EMAIL_HOST`: SMTP host (e.g. `smtp.sendgrid.net`)
- `EMAIL_PORT`: SMTP port (default `587`)
- `EMAIL_HOST_USER`: SMTP username
- `EMAIL_HOST_PASSWORD`: SMTP password
- `EMAIL_USE_TLS`: `True` or `False` (default `True`)
- `EMAIL_USE_SSL`: `True` or `False` (default `False`)
- `DEFAULT_FROM_EMAIL`: From address used when sending emails

For local development we use the console backend by default (emails are printed to the Django console). To test sending real mails, configure the above values and restart the server.

Example (PowerShell):

```powershell
$env:EMAIL_HOST = 'smtp.example.com'
$env:EMAIL_PORT = '587'
$env:EMAIL_HOST_USER = 'user@example.com'
$env:EMAIL_HOST_PASSWORD = 'supersecret'
$env:EMAIL_USE_TLS = 'True'
$env:DEFAULT_FROM_EMAIL = 'no-reply@yourdomain.com'
python manage.py runserver
```
# Backend (Django) — Placeholder

Planned backend: Django REST API to handle form submissions, budget simulation calculations, invoice generation and sending emails.

Planned endpoints (examples):
- `POST /api/budget/` — receive simulator form and return calculated totals
- `POST /api/contact/` — receive contact form and send email/notification
- `POST /api/invoice/` — persist invoice and trigger email with PDF

When ready, I will scaffold a Django project here and wire it to the Next.js frontend.
