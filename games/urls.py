#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: KaiSun

from django.conf.urls import url
from django.contrib import admin
from games import views

app_name = 'games'

urlpatterns = [
    url(r'^upload/', views.upload),
    url(r'^query_rank/', views.query_rank, name='query_rank'),
]