from django.urls import path
from .views import get_active_users, NewUserAPIView, UserList, UserListUnsafe, active_user, get_online, get_offline

from django.contrib.auth import views as auth_views


urlpatterns = [
    path('active_user_by_token/', active_user, name='active-user'),
    path('active_users/', get_active_users, name='active-users'),
    path('new_user/', NewUserAPIView.as_view(), name='new-user'),
    path('get_online/', get_online, name='get-online'),
    path('get_offline/', get_offline, name='get-offline'),
    path('all_users/', UserList.as_view(), name='get-all-users'),
    path('all_users_unsafe/', UserListUnsafe.as_view(), name='get-all-users-unsafe'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout')
]