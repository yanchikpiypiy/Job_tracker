from rest_framework import serializers
from .models import User, Application


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']



class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        exclude = ["date_applied", "created_at", "updated_at"]