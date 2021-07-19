from django.shortcuts import render
from .models import Projects, Messages
from django.http import FileResponse, HttpResponse
from django.core.files.storage import FileSystemStorage

# Create your views here.
def home(request):
    try:
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
    except:
        return render(request, 'error.html')

def error(request):
    return render(request, 'error.html')

def cv(request):
    fs = FileSystemStorage()
    filename = 'static/images/personal/Resume-May-2021.pdf'
    if fs.exists(filename):
        with fs.open(filename) as pdf:
            response = HttpResponse(pdf, content_type = 'application/pdf')
            response['Content-Disposition'] = f"inline; filename=Swarnabha Resume.pdf"
            return response
            
    else:
        return HttpResponse("Oops..Currently Resume isn't available!!")
    
def resume(request):
    fs = FileSystemStorage()
    filename = 'static/images/personal/Resume-July-2021.pdf'
    if fs.exists(filename):
        with fs.open(filename) as pdf:
            response = HttpResponse(pdf, content_type = 'application/pdf')
            response['Content-Disposition'] = f"inline; filename=Swarnabha Resume.pdf"
            return response
            
    else:
        return HttpResponse("Oops..Currently Resume isn't available!!")