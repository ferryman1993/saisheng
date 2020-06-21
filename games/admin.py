from django.contrib import admin
from games.models import Userinfo
# Register your models here.

class UserinfoAdmin(admin.ModelAdmin):
    list_display = ["username", "score"]


admin.site.register(Userinfo, UserinfoAdmin)
