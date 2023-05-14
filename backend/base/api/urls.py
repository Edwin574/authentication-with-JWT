from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from .views import MyTokenObtainpairView


urlpatterns = [
    path('', views.getRoutes),
    path('notes/', views.getNotes),
    path('token/', MyTokenObtainpairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
