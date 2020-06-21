from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django_redis import get_redis_connection
from django.core.cache import cache

from games.models import Userinfo

import json

conn = get_redis_connection('default')

# Create your views here.

def make_failed_msg(msg):
    r = dict()
    r['errno'] = 1
    r['errmsg'] = msg
    return json.dumps(r)


def make_success_msg(msg):
    r = dict()
    r['errno'] = 0
    r['errmsg'] = msg
    return json.dumps(r)


# 登陆
@csrf_exempt
def login(request):
    if request.method == 'GET':
        return render(request, 'login.html')
    if request.method == 'POST':
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        user = auth.authenticate(username=username,
                                 password=password)
        if user is not None and user.is_active:
            auth.login(request, user)
            return redirect('/games/upload/')
        else:
            return render(request, 'login.html')


# 登出
def logout(request):
    auth.logout(request)
    return redirect('/login')

@login_required(login_url='/login/')
@csrf_exempt
def upload(request):
    if request.method == "GET":
        return render(request, 'upload.html')
    elif request.method == "POST":
        score = request.POST.get('score', '')
        if int(score) < 0 or int(score) >10000000:
            return HttpResponse(make_failed_msg('请输入分数范围在0~10000000之间'))
        # 在redis中增加和修改当前用户的分数
        conn.zadd('games_rank', {str(request.user): score})
        old_score = Userinfo.objects.filter(username=request.user).first()
        if old_score:
            old_score.score = score
            old_score.save()
        else:
            Userinfo.objects.create(username=request.user, score=score)
        return HttpResponse(make_success_msg('上传成功'))
    else:
        return HttpResponse(make_failed_msg('请求方式不允许'))

@login_required(login_url='/login/')
@csrf_exempt
def query_rank(request):
    if request.method == 'GET':

        start = request.GET.get('start')
        end = request.GET.get('end')
        if int(start) < 1:
            return HttpResponse(make_failed_msg('输入值不能小于1'))
        if start and end:
            all_member = conn.zrevrange('games_rank', int(start)-1, end,
                                        withscores='withscores')
        else:
            all_member = conn.zrevrange('games_rank', 0, -1, withscores='withscores')
        current_rank = conn.zrevrank('games_rank', str(request.user))
        current_score = conn.zscore('games_rank', str(request.user))
        data = []
        for i in range(len(all_member)):
            rank = conn.zrevrank('games_rank', str(all_member[i][0],
                                                   encoding='utf8'))
            data.append({'rank':rank+1, 'user':str(all_member[i][0],
                                                  encoding='utf8'),
                         'score':all_member[i][1]})
        data.append({'rank':current_rank+1, 'score':current_score, 'user':
            request.user})
        return render(request, 'query_detail.html', {'data': data})