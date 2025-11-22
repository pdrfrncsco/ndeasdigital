from django.contrib import admin
from .models import ContactMessage, InvoiceRecord


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('created_at',)
    actions = ['mark_as_read']

    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        self.message_user(request, f"Marked {updated} messages as read.")
    mark_as_read.short_description = 'Mark selected messages as read'


@admin.register(InvoiceRecord)
class InvoiceRecordAdmin(admin.ModelAdmin):
    list_display = ('invoice_id', 'total', 'email_sent', 'created_at')
    list_filter = ('email_sent', 'created_at')
    search_fields = ('invoice_id',)
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
