from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.decorators import action
from .models import Meeting
from .serializers import MeetingSerializer
from rest_framework.permissions import IsAuthenticated

class MeetingViewSet(viewsets.ModelViewSet):
    serializer_class = MeetingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only return meetings for the current user
        return Meeting.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Automatically assigns the user from the JWT token
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'], url_path="by_month", name="Meetings By Month")
    def by_month(self, request):
        """Get meetings grouped by date for a specific month"""
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        
        if not year or not month:
            return Response({'error': 'Year and month required'}, status=400)
        
        meetings = Meeting.objects.filter(
            user=request.user,
            date__year=year,
            date__month=month
        ).order_by('date', 'time')
        
        # Group meetings by date key (YYYY-MM-DD format)
        grouped_meetings = {}
        for meeting in meetings:
            date_key = meeting.formatted_date_key
            if date_key not in grouped_meetings:
                grouped_meetings[date_key] = []
            
            # Use serializer - now frontend expects meeting_type
            meeting_serializer = MeetingSerializer(meeting)
            grouped_meetings[date_key].append(meeting_serializer.data)
        
        return Response(grouped_meetings)