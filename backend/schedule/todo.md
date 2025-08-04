# scheduling/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone

class Meeting(models.Model):
    MEETING_TYPES = [
        ('interview', 'Interview'),
        ('networking', 'Networking'),
        ('followup', 'Follow-up'),
        ('assessment', 'Assessment'),
        ('other', 'Other'),
    ]
    
    # Fields that match your frontend exactly
    title = models.CharField(max_length=200)
    time = models.CharField(max_length=10)  # Store as "14:30" format like frontend
    location = models.CharField(max_length=200, blank=True)
    attendees = models.CharField(max_length=500, blank=True)  # Comma-separated like frontend
    type = models.CharField(max_length=20, choices=MEETING_TYPES, default='interview')
    notes = models.TextField(blank=True)
    
    # Additional fields for backend functionality
    date = models.DateField()  # The date this meeting is on
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='meetings')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['date', 'time']
        
    def __str__(self):
        return f"{self.title} - {self.date} at {self.time}"
    
    @property
    def formatted_date_key(self):
        """Return date in the format your frontend expects: YYYY-MM-DD"""
        return self.date.strftime('%Y-%m-%d')

# scheduling/serializers.py (if using DRF)
from rest_framework import serializers
from .models import Meeting

class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = ['id', 'title', 'time', 'location', 'attendees', 'type', 'notes', 'date']
    
    def create(self, validated_data):
        # Automatically assign the current user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

# scheduling/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.dateparse import parse_date
from .models import Meeting
from .serializers import MeetingSerializer

class MeetingViewSet(viewsets.ModelViewSet):
    serializer_class = MeetingSerializer
    
    def get_queryset(self):
        # Only return meetings for the current user
        return Meeting.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def by_month(self, request):
        """Get meetings grouped by date for a specific month - matches your frontend structure"""
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
            
            # Convert to frontend format
            meeting_data = {
                'id': meeting.id,
                'title': meeting.title,
                'time': meeting.time,
                'location': meeting.location,
                'attendees': meeting.attendees,
                'type': meeting.type,
                'notes': meeting.notes,
                'date': meeting.date.isoformat()
            }
            grouped_meetings[date_key].append(meeting_data)
        
        return Response(grouped_meetings)
    
    def create(self, request):
        """Create a new meeting"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        """Delete a meeting"""
        try:
            meeting = Meeting.objects.get(pk=pk, user=request.user)
            meeting.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Meeting.DoesNotExist:
            return Response({'error': 'Meeting not found'}, status=404)

# scheduling/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MeetingViewSet

router = DefaultRouter()
router.register(r'meetings', MeetingViewSet, basename='meeting')

urlpatterns = [
    path('api/', include(router.urls)),
]

# Main urls.py (add this to your main project urls)
from django.urls import path, include

urlpatterns = [
    # ... your existing urls
    path('scheduling/', include('scheduling.urls')),
]

# Frontend API calls would look like:

"""
// Get meetings for current month
fetch(`/scheduling/api/meetings/by_month/?year=2024&month=12`)
  .then(response => response.json())
  .then(data => setMeetings(data));  // data matches your frontend format!

// Add new meeting
fetch('/scheduling/api/meetings/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken
  },
  body: JSON.stringify({
    title: newMeeting.title,
    time: newMeeting.time,
    location: newMeeting.location,
    attendees: newMeeting.attendees,
    type: newMeeting.type,
    notes: newMeeting.notes,
    date: selectedDate.toISOString().split('T')[0]  // YYYY-MM-DD format
  })
});

// Delete meeting
fetch(`/scheduling/api/meetings/${meetingId}/`, {
  method: 'DELETE',
  headers: {
    'X-CSRFToken': csrfToken
  }
});
"""

# Alternative: Simple Django Views (if not using DRF)

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from datetime import datetime

@csrf_exempt
@require_http_methods(["GET"])
def get_meetings_by_month(request):
    year = request.GET.get('year')
    month = request.GET.get('month')
    
    meetings = Meeting.objects.filter(
        user=request.user,
        date__year=year,
        date__month=month
    )
    
    # Group by date
    grouped_meetings = {}
    for meeting in meetings:
        date_key = meeting.formatted_date_key
        if date_key not in grouped_meetings:
            grouped_meetings[date_key] = []
        
        grouped_meetings[date_key].append({
            'id': meeting.id,
            'title': meeting.title,
            'time': meeting.time,
            'location': meeting.location,
            'attendees': meeting.attendees,
            'type': meeting.type,
            'notes': meeting.notes,
        })
    
    return JsonResponse(grouped_meetings)

@csrf_exempt
@require_http_methods(["POST"])
def create_meeting(request):
    data = json.loads(request.body)
    
    meeting = Meeting.objects.create(
        user=request.user,
        title=data['title'],
        time=data['time'],
        location=data.get('location', ''),
        attendees=data.get('attendees', ''),
        type=data.get('type', 'interview'),
        notes=data.get('notes', ''),
        date=datetime.strptime(data['date'], '%Y-%m-%d').date()
    )
    
    return JsonResponse({
        'id': meeting.id,
        'title': meeting.title,
        'time': meeting.time,
        'location': meeting.location,
        'attendees': meeting.attendees,
        'type': meeting.type,
        'notes': meeting.notes,
    })

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_meeting(request, meeting_id):
    try:
        meeting = Meeting.objects.get(id=meeting_id, user=request.user)
        meeting.delete()
        return JsonResponse({'success': True})
    except Meeting.DoesNotExist:
        return JsonResponse({'error': 'Meeting not found'}, status=404)