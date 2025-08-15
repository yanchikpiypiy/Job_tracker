from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Document
import os

@receiver(post_delete, sender=Document)
def delete_file_on_model_delete(sender, instance, **kwargs):
    if hasattr(instance, 'actual_file') and instance.actual_file:
        if os.path.isfile(instance.actual_file.path):
            os.remove(instance.actual_file.path)
