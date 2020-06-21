# Generated by Django 2.2.1 on 2020-06-21 03:37

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Userinfo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=64, unique=True, verbose_name='用户名称')),
                ('score', models.IntegerField(default=0, verbose_name='分数')),
            ],
            options={
                'verbose_name': '用户信息表',
                'verbose_name_plural': '用户信息表',
            },
        ),
    ]