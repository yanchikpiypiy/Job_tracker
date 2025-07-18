from django.urls import path, include,re_path
from core import views

from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
router = routers.DefaultRouter()
router.register(r"applications", views.ApplicationApiView)
router.register(r"userslist", views.UserViewSet, basename="users")
print(router.urls)

urlpatterns = [
    path("api/v1/", include(router.urls)),
    path("api/v1/auth/", include('djoser.urls')),
    path("api/v1/auth/", include('djoser.urls.jwt')),
    path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]
