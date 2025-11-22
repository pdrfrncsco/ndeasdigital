from django.urls import path
from . import views

urlpatterns = [
    path('budget/', views.budget_view, name='budget'),
    path('contact/', views.contact_view, name='contact'),
    path('invoice/', views.invoice_view, name='invoice'),
    path('invoices/', views.invoice_list_view, name='invoice-list'),
    path('invoices/<str:filename>/', views.invoice_download_view, name='invoice-download'),
    path('projects/', views.projects_list_view, name='projects-list'),
    path('projects/<slug:slug>/', views.project_detail_view, name='project-detail'),
]
