from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Create demo Project instances for development'

    def handle(self, *args, **options):
        from api.models import Project

        demos = [
            {
                'title': 'Projecto Teste',
                'category': 'Demo',
                'description': 'Este é um projecto de teste criado automaticamente para desenvolvimento.',
                'client_name': 'Cliente Demo',
                'img': 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                    'https://images.unsplash.com/photo-1581092921461-39b2f2c8a352?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
                ],
                'tags': ['Django', 'Next.js'],
                'link': 'https://example.com',
                'featured': True,
            },
            {
                'title': 'Outro Projeto Exemplo',
                'category': 'Web',
                'description': 'Outro projecto criado automaticamente.',
                'client_name': 'Cliente X',
                'img': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'gallery': [],
                'tags': ['React'],
                'link': '',
                'featured': False,
            }
        ]

        created = 0
        for d in demos:
            slug_base = d['title'].lower().replace(' ', '-')
            obj, was_created = Project.objects.get_or_create(slug=slug_base, defaults=d)
            if was_created:
                created += 1
                self.stdout.write(self.style.SUCCESS(f"Created demo project: {obj.title} (slug={obj.slug})"))
            else:
                self.stdout.write(self.style.NOTICE(f"Project already exists: {obj.title} (slug={obj.slug})"))

        self.stdout.write(self.style.SUCCESS(f"Done — created {created} new project(s)."))
