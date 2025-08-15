from rest_framework import serializers
from .models import Document
import os
class DocumentSerializer(serializers.ModelSerializer):
    file_size = serializers.ReadOnlyField()
    file_extension = serializers.ReadOnlyField()
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = ['id', 'name', 'document_type', 'actual_file', 'file_url', 'file_size', 
                 'file_extension', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def get_file_url(self, obj):
        """Get full URL for file"""
        if obj.actual_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.actual_file.url)
        return None
    
    def validate_actual_file(self, value):
        """Validate uploaded file"""
        # Check file size (50MB limit)
        if value.size > 50 * 1024 * 1024:
            raise serializers.ValidationError("File size cannot exceed 10MB.")
        
        # Check file extension
        allowed_extensions = ['.pdf', '.doc', '.docx', '.txt']
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in allowed_extensions:
            raise serializers.ValidationError(
                f"File type not allowed. Allowed types: {', '.join(allowed_extensions)}"
            )
        
        return value