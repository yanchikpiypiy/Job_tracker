from django.urls import path
from core import views
urlpatterns = [
    path("api/v1/application", view=views.ApplicationApiView.as_view(),name="Yan")
]
