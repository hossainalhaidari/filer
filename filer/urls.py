from os import path
from django.conf.urls import url
from django.conf.urls.static import static
from django.contrib import admin
from django.conf import settings

from . import views

urlpatterns = [
	url(r'^$', views.index, name='index'),
	url(r'^ajax/files/(?P<dir>.*)/$', views.files, name='files'),
	url(r'^ajax/newfile/(?P<path>.*)/$', views.newfile, name='newfile'),
	url(r'^ajax/newdir/(?P<path>.*)/$', views.newdir, name='newdir'),
	url(r'^ajax/zip/(?P<files>.*)/$', views.zip, name='zip'),
	url(r'^ajax/unzip/(?P<file>.*)/$', views.unzip, name='unzip'),
    url(r'^admin/', admin.site.urls),
]

if settings.DEBUG is True:
	urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)