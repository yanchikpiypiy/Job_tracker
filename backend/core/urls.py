from django.urls import path, include
from core import views

from rest_framework import routers

router = routers.DefaultRouter()
router.register(r"applications", views.ApplicationApiView)
router.register(r"user", views.UserViewSet)
print(router.urls)

urlpatterns = [
    path("api/", include(router.urls)),
]
