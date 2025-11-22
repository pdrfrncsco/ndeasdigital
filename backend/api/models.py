from django.db import models
from django.utils import timezone


class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} <{self.email}> - {self.subject}"


class InvoiceRecord(models.Model):
    invoice_id = models.CharField(max_length=100, unique=True)
    client = models.JSONField()
    items = models.JSONField()
    total = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    email_sent = models.BooleanField(default=False)
    attachment_path = models.CharField(max_length=1024, blank=True, null=True)
    telemetry_path = models.CharField(max_length=1024, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.invoice_id
