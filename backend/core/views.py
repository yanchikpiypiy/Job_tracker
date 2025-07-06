from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse
# Create your views here.
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.decorators import action
from .models import Application, User
from .serializers import ApplicationSerializer, UserSerializer

class ApplicationApiView(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(methods=["get"], detail=True, url_path="user_application")
    def UserApplication(self, request, pk):
        
        user = get_object_or_404(User, pk=pk)
        user_application = Application.objects.filter(user = user)
        user_application_serializer = ApplicationSerializer(user_application, many=True)
        return Response(user_application_serializer.data)