from django.db import models
from django.utils import timezone
from django.utils.text import slugify


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

class Project(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    category = models.CharField(max_length=120, blank=True)
    description = models.TextField(blank=True)
    client_name = models.CharField(max_length=200, blank=True)
    img = models.CharField(max_length=500, blank=True, help_text='Main image URL or path')
    gallery = models.JSONField(blank=True, default=list, help_text='List of image URLs')
    tags = models.JSONField(blank=True, default=list, help_text='List of tags')
    link = models.URLField(blank=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-featured', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)[:200]
            slug = base
            i = 1
            while Project.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{i}"
                i += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        if self.slug:
            return f"{self.title} ({self.slug})"
        return self.title
