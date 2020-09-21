from django.urls import path
from .views import get_all_users, get_current_users

urlpatterns = [
    path('all_users/', get_all_users, name='all-users'),
    path('current_users/', get_current_users),

]
