from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse
# Create your views here.
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.decorators import action
from .models import Application, User
from .serializers import ApplicationSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated


from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import EmailTokenObtainPairSerializer

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer


# all applications for dev purposes  
class ApplicationsApiView(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

class ApplicationApiView(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Application.objects.filter(user=self.request.user)
    
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=True,methods=["get"], url_path="user_application", name="User Application")
    def UserApplication(self, request, pk):
        
        user = get_object_or_404(User, pk=pk)
        user_application = Application.objects.filter(user = user)
        user_application_serializer = ApplicationSerializer(user_application, many=True)
        return Response(user_application_serializer.data)