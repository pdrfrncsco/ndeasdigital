import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get('DJANGO_SECRET', 'change-me-for-production')

DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend_project.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation (defaults)
AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
# Directory where `collectstatic` will gather static files for production.
# Set to a writable path inside the project; the deploy README expects a collectstatic
# step and the webserver (nginx) should serve files from this directory.
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Additional locations the staticfiles app will search (optional)
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

# CORS -- allow everything in dev
CORS_ALLOW_ALL_ORIGINS = DEBUG
# In production, set CORS_ALLOWED_ORIGINS env var to a comma-separated list
if not DEBUG:
    cors_raw = os.environ.get('CORS_ALLOWED_ORIGINS', '')
    if cors_raw:
        CORS_ALLOWED_ORIGINS = [e.strip() for e in cors_raw.split(',') if e.strip()]

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Email configuration
# Use environment variables in production. By default (DEBUG=True) use console backend.
EMAIL_BACKEND = os.environ.get('EMAIL_BACKEND') or ('django.core.mail.backends.console.EmailBackend' if DEBUG else 'django.core.mail.backends.smtp.EmailBackend')

# SMTP settings (used when EMAIL_BACKEND is smtp)
EMAIL_HOST = os.environ.get('EMAIL_HOST', '')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS', 'True').lower() in ('1', 'true', 'yes')
EMAIL_USE_SSL = os.environ.get('EMAIL_USE_SSL', 'False').lower() in ('1', 'true', 'yes')

DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', 'no-reply@ndeias.cloud')
# Optional: comma-separated fallback recipients for alerting when email send fails
EMAIL_FALLBACK_RECIPIENTS = None
if os.environ.get('EMAIL_FALLBACK_RECIPIENTS'):
    try:
        EMAIL_FALLBACK_RECIPIENTS = [e.strip() for e in os.environ.get('EMAIL_FALLBACK_RECIPIENTS').split(',') if e.strip()]
    except Exception:
        EMAIL_FALLBACK_RECIPIENTS = None

# Tune retry behaviour via env vars if desired
EMAIL_SEND_MAX_ATTEMPTS = int(os.environ.get('EMAIL_SEND_MAX_ATTEMPTS', '3'))
EMAIL_SEND_BASE_DELAY = float(os.environ.get('EMAIL_SEND_BASE_DELAY', '1.0'))

# Minimal logging configuration: console + file (tmp/email_errors.log)
LOG_DIR = BASE_DIR / 'tmp'
LOG_DIR.mkdir(parents=True, exist_ok=True)
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {'format': '[%(asctime)s] %(levelname)s %(name)s: %(message)s'},
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': str(LOG_DIR / 'email_errors.log'),
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'INFO',
    },
}

# Media files (user uploads)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
