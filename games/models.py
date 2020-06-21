from django.db import models

# Create your models here.

class Userinfo(models.Model):
    username = models.CharField(max_length=64, unique=True, verbose_name='用户名称')
    score = models.IntegerField(default=0, verbose_name='分数' )

    class Meta():
        verbose_name = u'用户信息表'
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.username



