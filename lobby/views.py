from django.shortcuts import render
from django.contrib.sessions.models import Session
from django.utils import timezone
from django.core.cache import caches

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from django.contrib.auth.models import User
from .serializers import UserSerializer
from lobby.models import Profile

from rest_framework import generics, permissions


@api_view(['GET'])
@permission_classes([])
def get_current_users(request):
    response_list = []
    users_current = User.objects.filter(profile__is_online=True)
    # users_current = User.objects.all()
    serializer = UserSerializer(users_current, many=True)
    return Response(serializer.data)
    # for user in users_current:
    #     user_data = {}
    #     # if user.online():
    #     #     user_data['username'] = user.username
    #     #     response_list.append(user_data)
    #     user_data['seen'] = user.profile.online() or "Problem with cache"
    #     response_list.append(user_data)
    # return Response(response_list)
# q_ids = [o.id for o in q if o.method()]
# users_current = users_current.filter(id__in=q_ids)


@api_view(['GET'])
@permission_classes([])
def get_all_users(request):
    """
    Determine the current user by their token, and return their data
    """
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver


@receiver(user_logged_in)
def got_online(sender, user, request, **kwargs):
    user.profile.is_online = True
    user.profile.save()


@receiver(user_logged_out)
def got_offline(sender, user, request, **kwargs):
    user.profile.is_online = False
    user.profile.save()




