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
    
    title = models.CharField(max_length=200)
    time = models.CharField(max_length=10)  # Store as "14:30" format like frontend
    location = models.CharField(max_length=200, blank=True)
    attendees = models.CharField(max_length=500, blank=True)
    meeting_type = models.CharField(max_length=20, choices=MEETING_TYPES, default='interview')
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
