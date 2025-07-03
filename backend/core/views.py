from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.
from rest_framework.generics import ListCreateAPIView
from .models import Application
from .serializers import ApplicationSerializer

class ApplicationApiView(ListCreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer