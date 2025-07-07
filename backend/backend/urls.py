from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def home_view(request):
    return JsonResponse({
        'message': 'Django API Server is running!',
        'endpoints': {
            'admin': '/admin/',
            'api': '/api/',
            'register': '/api/register/',
            'login': '/api/login/',
            'logout': '/api/logout/',
            'profile': '/api/profile/',
            'user-info': '/api/user-info/',
            'token-refresh': '/api/token/refresh/'
        }
    })

urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)