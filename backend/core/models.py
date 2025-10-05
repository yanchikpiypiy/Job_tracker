from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import AbstractUser, BaseUserManager


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(
        default=now, editable=False, verbose_name="Created At"
    )
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated at")

    class Meta:
        abstract = True
        ordering = ["-created_at"]

    def __str__(self):
        return f"Created at: {self.created_at}, Updated at: {self.updated_at}"


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser, TimeStampedModel):
    # Basic auth fields
    email = models.EmailField(unique=True)

    # Profile fields - THESE ARE THE NEW FIELDS YOU NEED
    phone = models.CharField(
        max_length=20, blank=True, null=True, verbose_name="Phone Number"
    )
    location = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Location"
    )
    bio = models.TextField(blank=True, null=True, verbose_name="Biography")

    # Professional information - THESE ARE THE NEW FIELDS YOU NEED
    title = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Job Title"
    )
    company = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Company"
    )

    EXPERIENCE_CHOICES = [
        ("entry", "Entry Level (0-2 years)"),
        ("mid", "Mid Level (2-5 years)"),
        ("senior", "Senior Level (5-10 years)"),
        ("lead", "Lead/Principal (10+ years)"),
    ]
    experience = models.CharField(
        max_length=20,
        choices=EXPERIENCE_CHOICES,
        blank=True,
        null=True,
        verbose_name="Experience Level",
    )

    education = models.CharField(
        max_length=200, blank=True, null=True, verbose_name="Education"
    )
    skills = models.JSONField(default=list, blank=True, verbose_name="Skills")

    # Profile image - OPTIONAL BUT NICE TO HAVE
    profile_image = models.ImageField(
        upload_to="profile_images/", blank=True, null=True, verbose_name="Profile Image"
    )

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return f"{self.username} ({self.email})"

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"


class Application(TimeStampedModel):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="applications"
    )
    position = models.CharField(max_length=100, blank=True)
    company = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=100, blank=True)

    # Job type: where work happens
    REMOTE = "REMOTE"
    HYBRID = "HYBRID"
    ONSITE = "ONSITE"
    JOB_TYPE_CHOICES = [
        (REMOTE, "Remote"),
        (HYBRID, "Hybrid"),
        (ONSITE, "On-site"),
    ]
    job_type = models.CharField(max_length=10, choices=JOB_TYPE_CHOICES, default=REMOTE)

    # Application status: stage of hiring
    APPLIED = "APPLIED"
    REFUSED = "REFUSED"
    INTERVIEW = "INTERVIEW"
    OFFER = "OFFER"
    PENDING = "PENDING"
    STATUS_CHOICES = [
        (APPLIED, "Applied"),
        (REFUSED, "Refused"),
        (INTERVIEW, "Interview"),
        (OFFER, "Offer"),
        (PENDING, "Pending"),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=APPLIED)
    date_applied = models.DateTimeField(default=now, editable=True)
    salary = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.position} at {self.company} ({self.status})"
