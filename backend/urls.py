from django.urls import path, include
from . import views

urlpatterns = [    
    path('', views.home, name="home"),
    path('cv', views.cv, name='Swarnabha Resume'),
    path('resume', views.resume, name='Swarnabha CV'),
    path('error', views.error, name="error"),
]