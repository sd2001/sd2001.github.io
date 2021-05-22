from django.urls import path, include
from . import views

urlpatterns = [    
    path('', views.home, name="home"),
    path('resume', views.resume, name='resume'),
    path('error', views.error, name="error"),
]