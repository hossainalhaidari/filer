import base64
from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings

from .helper import *

def index(request):
	files = Files(request.user)
	filesList = files.list(settings.DEFAULT_PATH)
	curdir = settings.DEFAULT_PATH
	return render(request, 'index.html', {'files': filesList, 'curdir': curdir})

def files(request, dir):
	files = Files(request.user)
	filesList = files.list(dir)
	parentdir = files.parent(dir)
	return render(request, 'files.html', {'files': filesList, 'curdir': dir, 'parentdir': parentdir})

def newfile(request, path):
	files = Files(request.user)
	files.newfile(path)
	return HttpResponse(files.list(dir), content_type="application/json")

def newdir(request, path):
	files = Files(request.user)
	files.newdir(path)
	return HttpResponse(files.list(dir), content_type="application/json")

def zip(request, file, dest):
	files = Files(request.user)
	files.zip(file, dest)
	return HttpResponse(files.list(dir), content_type="application/json")

def unzip(request, file):
	files = Files(request.user)
	files.unzip(file, dir)
	return HttpResponse(files.list(dir), content_type="application/json")
