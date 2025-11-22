from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import BudgetSerializer, ContactSerializer, InvoiceSerializer, ProjectSerializer
from .models import ContactMessage, InvoiceRecord, Project
from django.conf import settings
from django.core.mail import EmailMessage
import os
import base64
import json
from django.http import FileResponse, Http404
from django.urls import reverse
import time
import logging
import traceback
from datetime import datetime


@api_view(['POST'])
def budget_view(request):
    serializer = BudgetSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    # Very simple estimation logic for demo purposes
    # Base cost assumes a Web implementation
    base = 150000
    system_type = data.get('system_type', 'institutional')
    if system_type == 'ecommerce':
        base = 350000

    # Platform-specific additional costs (base covers Web)
    platforms = data.get('platforms', []) or []
    # Normalize possible values like 'all' -> treat as android + ios + web
    if 'all' in platforms:
        platforms = ['web', 'android', 'ios']

    platform_cost_map = {
        'web': 0,
        'android': 500000,
        'ios': 500000,
    }
    platforms_cost = 0
    for p in platforms:
        platforms_cost += platform_cost_map.get(p, 0)

    features_count = len(data.get('features', []))
    features_cost = features_count * 20000

    hosting_map = {'basic': 50000, 'professional': 100000, 'premium': 200000}
    hosting_cost = hosting_map.get(data.get('hosting'), 0)

    domain_map = {'ao': 25000, 'com': 35000, 'org': 35000, 'net': 35000}
    domain_cost = domain_map.get(data.get('domain'), 0)

    support_cost = 75000 if data.get('support') else 0

    subtotal = base + platforms_cost + features_cost + hosting_cost + domain_cost + support_cost
    iva = round(subtotal * 0.14)
    total = subtotal + iva

    resp = {
        'development': base,
        'platforms_cost': platforms_cost,
        'features': features_cost,
        'hosting': hosting_cost,
        'domain': domain_cost,
        'support': support_cost,
        'subtotal': subtotal,
        'iva': iva,
        'total': total,
    }

    return Response(resp)


@api_view(['POST'])
def contact_view(request):
    serializer = ContactSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    data = serializer.validated_data
    # persist contact message for admin review
    try:
        ContactMessage.objects.create(
            name=data.get('name'),
            email=data.get('email'),
            phone=data.get('phone', ''),
            subject=data.get('subject'),
            message=data.get('message')
        )
    except Exception:
        # Do not fail the API if DB insert fails; just log
        logging.getLogger(__name__).exception('Failed to save contact message')

    return Response({'status': 'ok', 'message': 'Contato recebido'}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def invoice_view(request):
    serializer = InvoiceSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    logger = logging.getLogger(__name__)

    # Placeholder: generate invoice id and return it
    invoice_id = 'INV' + str(os.getpid()) + str(len(request.data.get('items', [])))

    # Normalize client/items if they arrived as JSON strings (multipart/form-data)
    raw_client = request.data.get('client')
    raw_items = request.data.get('items')
    # items may arrive as a JSON string, or as a list of JSON strings (multipart/form-data).
    if raw_items is not None:
        parsed_items = None
        try:
            # If it's a single JSON string representing a list
            if isinstance(raw_items, str):
                parsed = json.loads(raw_items)
                # if parsed is list of dicts, use it
                if isinstance(parsed, list):
                    parsed_items = parsed
                else:
                    # single dict? wrap
                    parsed_items = [parsed]
            elif isinstance(raw_items, (list, tuple)):
                parsed_items = []
                for element in raw_items:
                    if isinstance(element, str):
                        try:
                            v = json.loads(element)
                            # if element parsed to list, extend, otherwise append
                            if isinstance(v, list):
                                parsed_items.extend(v)
                            else:
                                parsed_items.append(v)
                        except Exception:
                            # element is a plain string; keep as-is
                            parsed_items.append(element)
                    else:
                        parsed_items.append(element)
        except Exception:
            parsed_items = None

        if parsed_items is not None:
            try:
                request.data._mutable = True
                request.data['items'] = parsed_items
                request.data._mutable = False
            except Exception:
                pass

    # If a PDF file was uploaded, and a recipient email provided and email settings exist, try to send
    to_email = None
    try:
        to_email = request.data.get('to_email') or (request.data.get('client') or {}).get('email')
    except Exception:
        to_email = None

    sent = False
    attachment_info = None
    telemetry = {
        'invoice_id': invoice_id,
        'attempts': [],
        'timestamp': datetime.utcnow().isoformat() + 'Z'
    }

    # Check for multipart file upload
    pdf_file = None
    if hasattr(request, 'FILES') and request.FILES.get('pdf'):
        pdf_file = request.FILES.get('pdf')
    else:
        # Also accept base64 encoded PDF in JSON body under 'pdf_base64'
        pdf_b64 = request.data.get('pdf_base64')
        if pdf_b64:
            try:
                pdf_bytes = base64.b64decode(pdf_b64)
                # write temporary file
                tmp_path = os.path.join(settings.BASE_DIR, 'tmp')
                os.makedirs(tmp_path, exist_ok=True)
                filename = f"invoice_{invoice_id}.pdf"
                fullpath = os.path.join(tmp_path, filename)
                with open(fullpath, 'wb') as f:
                    f.write(pdf_bytes)
                pdf_file = open(fullpath, 'rb')
                attachment_info = fullpath
            except Exception:
                pdf_file = None

    if pdf_file and to_email and getattr(settings, 'EMAIL_HOST', None):
        # Prepare recipients and CC (send copy to sender if provided)
        client_email = to_email
        cc_emails = []
        sender_email = None
        try:
            # Accept an optional sender_email field in payload; include as CC by default
            sender_email = request.data.get('sender_email') or (request.data.get('sender') or {}).get('email')
        except Exception:
            sender_email = None
        if sender_email:
            cc_emails.append(sender_email)

        subject = f"Fatura Proforma {invoice_id}"
        body = f"Segue em anexo a fatura proforma {invoice_id}."

        max_attempts = int(getattr(settings, 'EMAIL_SEND_MAX_ATTEMPTS', 3))
        base_delay = float(getattr(settings, 'EMAIL_SEND_BASE_DELAY', 1.0))

        # Try sending with retry/backoff and collect telemetry
        last_exception = None
        for attempt in range(1, max_attempts + 1):
            attempt_info = {'attempt': attempt, 'time': datetime.utcnow().isoformat() + 'Z'}
            try:
                email = EmailMessage(subject, body, settings.DEFAULT_FROM_EMAIL, [client_email])
                if cc_emails:
                    # set cc attribute for EmailMessage
                    email.cc = cc_emails
                # Attach PDF data
                if hasattr(pdf_file, 'read'):
                    pdf_file.seek(0)
                    email.attach(f"invoice_{invoice_id}.pdf", pdf_file.read(), 'application/pdf')
                else:
                    # pdf_file is likely a path
                    try:
                        email.attach_file(pdf_file)
                    except Exception:
                        # if attaching by path failed, try reading bytes
                        with open(pdf_file, 'rb') as ftmp:
                            email.attach(f"invoice_{invoice_id}.pdf", ftmp.read(), 'application/pdf')

                # Optionally set reply_to if provided
                reply_to = request.data.get('reply_to')
                if reply_to:
                    email.reply_to = [reply_to]

                email.send(fail_silently=False)
                sent = True
                attempt_info['status'] = 'ok'
                telemetry['attempts'].append(attempt_info)
                logger.info('Invoice %s sent to %s (attempt %d)', invoice_id, client_email, attempt)
                break
            except Exception as e:
                last_exception = e
                tb = traceback.format_exc()
                attempt_info['status'] = 'error'
                attempt_info['error'] = str(e)
                attempt_info['traceback'] = tb
                telemetry['attempts'].append(attempt_info)
                logger.exception('Error sending invoice %s on attempt %d', invoice_id, attempt)
                # exponential backoff
                if attempt < max_attempts:
                    sleep_sec = base_delay * (2 ** (attempt - 1))
                    time.sleep(sleep_sec)

        # If not sent, try fallback: notify fallback recipients and persist telemetry
        if not sent:
            # Ensure tmp dir exists and write telemetry JSON for later inspection/retry
            tmp_path = os.path.join(settings.BASE_DIR, 'tmp')
            os.makedirs(tmp_path, exist_ok=True)
            failfile = os.path.join(tmp_path, f'failed_email_{invoice_id}.json')
            try:
                with open(failfile, 'w', encoding='utf-8') as fh:
                    json.dump(telemetry, fh, ensure_ascii=False, indent=2)
                logger.warning('Wrote failed email telemetry to %s', failfile)
            except Exception:
                logger.exception('Failed to write telemetry for invoice %s', invoice_id)

            # Attempt fallback notification to admins/fallback recipients if configured
            fallback_raw = os.environ.get('EMAIL_FALLBACK_RECIPIENTS') if hasattr(os, 'environ') else None
            fallback_list = []
            if fallback_raw:
                try:
                    # allow comma-separated list
                    fallback_list = [e.strip() for e in fallback_raw.split(',') if e.strip()]
                except Exception:
                    fallback_list = []

            # also check settings var
            if getattr(settings, 'EMAIL_FALLBACK_RECIPIENTS', None):
                try:
                    fallback_list.extend([e for e in settings.EMAIL_FALLBACK_RECIPIENTS if e])
                except Exception:
                    pass

            if fallback_list:
                try:
                    fallback_subject = f"[ALERTA] Falha envio fatura {invoice_id}"
                    fallback_body = f"Houve uma falha ao enviar a fatura {invoice_id} para {client_email}.\n\nVeja o ficheiro de telemetria {failfile} para detalhes.\n\nÚltimo erro: {str(last_exception)}"
                    fallback_email = EmailMessage(fallback_subject, fallback_body, settings.DEFAULT_FROM_EMAIL, fallback_list)
                    # attach the invoice PDF if available
                    try:
                        if attachment_info and os.path.exists(attachment_info):
                            fallback_email.attach_file(attachment_info)
                    except Exception:
                        logger.exception('Could not attach pdf for fallback email %s', invoice_id)
                    fallback_email.send(fail_silently=True)
                    logger.info('Sent fallback notification for invoice %s to %s', invoice_id, fallback_list)
                except Exception:
                    logger.exception('Failed to send fallback notification for invoice %s', invoice_id)
        else:
            # Sent successfully: clean up any temporary file that we created
            if attachment_info and os.path.exists(attachment_info):
                try:
                    # close if it's an open file
                    try:
                        if hasattr(pdf_file, 'close'):
                            pdf_file.close()
                    except Exception:
                        pass
                    os.remove(attachment_info)
                    logger.info('Removed temporary invoice file %s after successful send', attachment_info)
                except Exception:
                    logger.exception('Failed removing temporary invoice file %s', attachment_info)

    # Persist invoice record for admin review
    try:
        # compute simple total if provided in items
        total_val = None
        try:
            if isinstance(request.data.get('items'), (list, tuple)):
                s = 0
                for it in request.data.get('items'):
                    # expect item to have 'price' and optional 'quantity'
                    price = float(it.get('price') or 0)
                    qty = float(it.get('quantity') or 1)
                    s += price * qty
                total_val = round(s, 2)
        except Exception:
            total_val = None

        InvoiceRecord.objects.create(
            invoice_id=invoice_id,
            client=request.data.get('client') or {},
            items=request.data.get('items') or [],
            total=total_val,
            email_sent=sent,
            attachment_path=attachment_info or '',
            telemetry_path=failfile if (not sent and 'failfile' in locals()) else None
        )
    except Exception:
        logging.getLogger(__name__).exception('Failed to persist InvoiceRecord %s', invoice_id)

    resp = {'status': 'created', 'invoice_id': invoice_id, 'email_sent': sent}
    if attachment_info:
        resp['attachment_path'] = attachment_info

    return Response(resp, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def invoice_list_view(request):
    """List generated invoice PDF files in backend/tmp for development inspection."""
    tmp_path = os.path.join(settings.BASE_DIR, 'tmp')
    os.makedirs(tmp_path, exist_ok=True)
    files = []
    for fname in sorted(os.listdir(tmp_path), reverse=True):
        full = os.path.join(tmp_path, fname)
        if os.path.isfile(full) and fname.lower().endswith('.pdf'):
            stat = os.stat(full)
            files.append({
                'filename': fname,
                'size': stat.st_size,
                'modified': time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(stat.st_mtime)),
                'download_url': request.build_absolute_uri(reverse('invoice-download', args=[fname]))
            })
    return Response({'files': files})


@api_view(['GET'])
def projects_list_view(request):
    qs = Project.objects.all().order_by('-featured', '-created_at')
    projects = []
    for p in qs:
        projects.append({
            'id': p.id,
            'slug': p.slug,
            'title': p.title,
            'category': p.category,
            'description': p.description,
            'tags': p.tags or [],
            'img': p.img or '',
            'gallery': p.gallery or [],
            'client_name': p.client_name or '',
            'link': p.link or '',
            'featured': p.featured,
        })
    return Response({'projects': projects})


@api_view(['GET'])
def project_detail_view(request, slug):
    try:
        p = Project.objects.get(slug=slug)
    except Project.DoesNotExist:
        return Response({'detail': 'Not found'}, status=404)

    data = {
        'id': p.id,
        'slug': p.slug,
        'title': p.title,
        'category': p.category,
        'description': p.description,
        'tags': p.tags or [],
        'img': p.img or '',
        'gallery': p.gallery or [],
        'client_name': p.client_name or '',
        'link': p.link or '',
        'featured': p.featured,
        'created_at': p.created_at,
    }
    return Response({'project': data})


def invoice_download_view(request, filename):
    """Serve a generated invoice PDF as attachment. Filename is sanitized."""
    tmp_path = os.path.join(settings.BASE_DIR, 'tmp')
    safe = os.path.basename(filename)
    full = os.path.join(tmp_path, safe)
    if not os.path.exists(full):
        raise Http404('File not found')
    return FileResponse(open(full, 'rb'), as_attachment=True, filename=safe, content_type='application/pdf')
