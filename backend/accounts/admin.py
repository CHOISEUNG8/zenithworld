from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'name', 'phone', 'is_staff', 'is_active', 'created_at')
    list_filter = ('is_staff', 'is_active', 'gender', 'created_at')
    search_fields = ('username', 'name', 'phone')
    ordering = ('-created_at',)
    
    fieldsets = UserAdmin.fieldsets + (
        ('추가 정보', {
            'fields': ('name', 'phone', 'birth_date', 'gender')
        }),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('추가 정보', {
            'fields': ('name', 'phone', 'birth_date', 'gender')
        }),
    )