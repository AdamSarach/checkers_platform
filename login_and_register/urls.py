from django.urls import path
from .views import current_user, NewUserAPIView, UserList, UserListUnsafe

from django.contrib.auth import views as auth_views


urlpatterns = [
    path('current_user/', current_user),
    path('new_user/', NewUserAPIView.as_view()),
    path('all_users/', UserList.as_view(), name='get-all-users'),
    path('all_users_unsafe/', UserListUnsafe.as_view()),
    path('logout/', auth_views.LogoutView.as_view(), name='logout')
]