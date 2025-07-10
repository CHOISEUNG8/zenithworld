from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    register_view, logout_view, profile_view, user_info_view,
    # 관리자용 API
    AdminDashboardView, AdminUserListView, AdminUserDetailView,
    AdminUserCreateView, AdminUserUpdateView, AdminUserDeleteView,
    AdminStatsView, AdminOrderListView, AdminProductListView
)

urlpatterns = [
    # 기존 사용자 API
    path('register/', register_view, name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('logout/', logout_view, name='logout'),
    path('profile/', profile_view, name='profile'),
    path('user-info/', user_info_view, name='user-info'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    
    # 관리자용 API
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('admin/users/', AdminUserListView.as_view(), name='admin-users'),
    path('admin/users/create/', AdminUserCreateView.as_view(), name='admin-user-create'),
    path('admin/users/<int:pk>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('admin/users/<int:pk>/update/', AdminUserUpdateView.as_view(), name='admin-user-update'),
    path('admin/users/<int:pk>/delete/', AdminUserDeleteView.as_view(), name='admin-user-delete'),
    path('admin/orders/', AdminOrderListView.as_view(), name='admin-orders'),
    path('admin/products/', AdminProductListView.as_view(), name='admin-products'),
] 