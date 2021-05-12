from django.shortcuts import render
from .models import Projects, Messages

# Create your views here.
def home(request):
    # try:
        projects = Projects.objects.all()
        confirm = ""
        if request.method == 'POST':        
            name = request.POST.get('Name')
            email = request.POST.get('Email')
            message = request.POST.get('Message')        
            print(name, email, message)
            mssg = Messages(name = name, email = email, message = message)
            confirm = "Thanks for Sharing"
            mssg.save()        
        
        value = {'projects': projects, 'confirm': confirm}    
        return render(request, 'index.html', value)
    # except:
    #     return render(request, 'error.html')

def error(request):
    return render(request, 'error')