from django.db import models
from django.utils.timezone import now
# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
class TimeStampedModel(models.Model):

    created_at = models.DateTimeField(default=now, editable=False, verbose_name="Created At")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated at")

    class Meta:
        abstract = True
        ordering = ["-created_at"]

    def __str__(self):
        return f"Created at: {self.created_at}, Updated at: {self.updated_at}"


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class User(AbstractUser,TimeStampedModel):
    
    email = models.EmailField(unique=True)  
    objects = CustomUserManager()
    USERNAME_FIELD = 'email'  # Tell Django to use email to log in
    REQUIRED_FIELDS = ["username"]
    def __str__(self):
        return f"{self.first_name} + {self.email} user in the db"
    

class Application(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="applications")

    position = models.CharField(max_length=100,blank=True)
    company = models.CharField(max_length=100,blank=True)
    location = models.CharField(max_length=100, blank=True)

    # Job type: where work happens
    REMOTE = 'REMOTE'
    HYBRID = 'HYBRID'
    ONSITE = 'ONSITE'

    JOB_TYPE_CHOICES = [
        (REMOTE, 'Remote'),
        (HYBRID, 'Hybrid'),
        (ONSITE, 'On-site'),
    ]

    job_type = models.CharField(max_length=10, choices=JOB_TYPE_CHOICES, default=REMOTE)

    # Application status: stage of hiring
    APPLIED = 'APPLIED'
    REFUSED = 'REFUSED'
    INTERVIEW = 'INTERVIEW'
    OFFER = 'OFFER'
    PENDING = 'PENDING'

    STATUS_CHOICES = [
        (APPLIED, 'Applied'),
        (REFUSED, 'Refused'),
        (INTERVIEW, 'Interview'),
        (OFFER, 'Offer'),
        (PENDING, 'Pending'),
    ]

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=APPLIED)

    date_applied = models.DateTimeField(default=now, editable=False)
    salary = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.position} at {self.company} ({self.status})"

