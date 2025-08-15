from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import Http404, HttpResponse, FileResponse
from django.shortcuts import get_object_or_404
from .models import Document
from .serializers import DocumentSerializer

class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        """Return documents for the current user only"""
        return Document.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Set the user when creating a document"""
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        """Enhanced create with better error handling"""
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {'error': f'Upload failed: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Download a document file"""
        document = self.get_object()
        try:
            return FileResponse(
                document.actual_file.open('rb'),
                as_attachment=True,
                filename=f"{document.name}{document.file_extension}"
            )
        except FileNotFoundError:
            return Response(
                {'error': 'File not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get document statistics for the user"""
        queryset = self.get_queryset()
        stats = {
            'total_documents': queryset.count(),
            'by_type': {}
        }
        
        for doc_type, _ in Document.DOCUMENT_TYPES:
            count = queryset.filter(document_type=doc_type).count()
            stats['by_type'][doc_type] = count
        
        return Response(stats)
