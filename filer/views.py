import base64
from django.shortcuts import render
from django.http import HttpResponse

from .helper import *

def index(request):
	files = Files(request.user)
	filesList = files.list('')
	return render(request, 'index.html', {'files': filesList})

def files(request, dir):
	files = Files(request.user)
	filesList = files.list(dir)
	curdir = files.parent(dir)
	return render(request, 'files.html', {'files': filesList, 'curdir': curdir})

def newfile(request, path):
	files = Files(request.user)
	files.newfile(path)
	return HttpResponse(files.list(dir), content_type="application/json")

def newdir(request, path):
	files = Files(request.user)
	files.newdir(path)
	return HttpResponse(files.list(dir), content_type="application/json")

def zip(request, files, dest):
	files = Files(request.user)
	files.zip(files, dest)
	return HttpResponse(files.list(dir), content_type="application/json")

def unzip(request, file):
	files = Files(request.user)
	return HttpResponse(files.list(dir), content_type="application/json")
