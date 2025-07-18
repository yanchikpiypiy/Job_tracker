from rest_framework import serializers
from .models import User, Application
# serializers.py
from rest_framework import exceptions
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model

User = get_user_model()

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        credentials = {
            'email': attrs.get('email'),
            'password': attrs.get('password')
        }

        user = authenticate(**credentials)

        if user:
            if not user.is_active:
                raise exceptions.AuthenticationFailed('User is deactivated')

            data = {}
            refresh = self.get_token(user)

            data['refresh'] = str(refresh)
            data['access'] = str(refresh.access_token)

            return data
        else:
            raise exceptions.AuthenticationFailed('No active account found with the given credentials')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']



class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        exclude = ["date_applied", "created_at", "updated_at"]