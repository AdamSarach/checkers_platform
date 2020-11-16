from django.urls import path
from .views import get_active_users, NewUserAPIView, UserList, UserListUnsafe, active_user, get_online, get_offline, \
    get_in_game_users, make_in_game, make_out_game

from django.contrib.auth import views as auth_views

urlpatterns = [
    path('active_user_by_token/', active_user, name='active-user'),
    path('active_users/', get_active_users, name='active-users'),
    path('new_user/', NewUserAPIView.as_view(), name='new-user'),
    path('get_online/', get_online, name='get-online'),
    path('get_offline/', get_offline, name='get-offline'),
    path('in_game/', make_in_game, name='in-game'),
    path('out_game/', make_out_game, name='out-game'),
    path('all_users/', UserList.as_view(), name='get-all-users'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('game_users/', get_in_game_users, name='game-users'),
]
