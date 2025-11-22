from django.contrib import admin
from .models import ContactMessage, InvoiceRecord
from .models import Project, ProjectImage
from django.utils.html import format_html


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

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'client_name', 'category', 'featured', 'created_at')
    search_fields = ('title', 'client_name', 'category', 'tags')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at',)

    def thumbnail(self, obj):
        first = None
        try:
            first = obj.images.first()
        except Exception:
            first = None
        if first and getattr(first, 'image', None):
            return format_html('<img src="{}" style="max-width:120px;max-height:80px;object-fit:cover;"/>', first.image.url)
        if obj.img:
            return format_html('<img src="{}" style="max-width:120px;max-height:80px;object-fit:cover;"/>', obj.img)
        return ''

    thumbnail.short_description = 'Thumbnail'
    list_display = ('thumbnail',) + list_display


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1
    fields = ('image', 'caption', 'ordering')

ProjectAdmin.inlines = [ProjectImageInline]
