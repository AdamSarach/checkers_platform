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
    users_current = Profile.objects.all()
    # serializer = UserSerializer(users, many=True)
    for user in users_current:
        user_data = {}
        # if user.online():
        #     user_data['username'] = user.username
        #     response_list.append(user_data)
        user_data['seen'] = user.online() or "Problem with cache"
        response_list.append(user_data)
    return Response(response_list)
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




