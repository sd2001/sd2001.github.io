from django.db import models
from cloudinary.models import CloudinaryField
# Create your models here.

class Projects(models.Model):
    name = models.CharField(max_length=30, null=False)
    description = models.CharField(max_length=100, null=False)
    image = CloudinaryField('image', default="https://res.cloudinary.com/sd2001/image/upload/v1620818730/temp_cvo0h5.jpg", null=True)
    github = models.CharField(max_length=100, null=False)
    live = models.CharField(max_length=100, null=True, blank=True)
    
    def __str__(self):
        return self.name
    
class Messages(models.Model):
    name =  models.CharField(max_length=30, null=False)
    email =  models.CharField(max_length=30, null=True)
    message = models.TextField(null = False)
    
    def __str__(self):
        return self.name
