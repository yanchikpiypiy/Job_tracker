from django.urls import path, include,re_path
from core import views
from .views import EmailTokenObtainPairView
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
router = routers.DefaultRouter()
router.register(r"applications", views.ApplicationApiView, basename="applications")
router.register(r"userslist", views.UserViewSet, basename="users")
router.register(r"applicationall", views.ApplicationsApiView, basename="allapplications")
print(router.urls)

urlpatterns = [
    path("api/v1/", include(router.urls)),
    path("api/v1/auth/", include('djoser.urls')),
    path("api/v1/auth/", include('djoser.urls.jwt')),
    path('api/v1/auth/token/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]
