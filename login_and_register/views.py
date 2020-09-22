from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver

from django.contrib.auth.models import User
from .serializers import UserSerializer, UserCreationSerializer


from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import generics
from rest_framework.permissions import *


class NewUserAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreationSerializer
    permission_classes = (AllowAny,)


@api_view(['GET'])
def current_user(request):
    user = JWTAuthentication.get_user(request.data)
    serializer = UserSerializer(user)
    if serializer.is_valid():
        return Response(serializer.data)
    else:
        Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

'''Add token to blacklist - ToDo'''
# @api_view(['GET'])
# def logout_view(request):
#     logout(request)
#     # return Response({"message": "User logged out succesfully."})


class UserList(APIView):

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserListUnsafe(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_current_users(request):
    response_list = []
    users_current = User.objects.filter(profile__is_online=True)
    serializer = UserSerializer(users_current, many=True)
    if serializer.is_valid():
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([])
def get_current_users_unsafe(request):
    response_list = []
    users_current = User.objects.filter(profile__is_online=True)
    serializer = UserSerializer(users_current, many=True)
    if serializer.is_valid():
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@receiver(user_logged_in)
def got_online(sender, user, request, **kwargs):
    user.profile.is_online = True
    user.profile.save()


@receiver(user_logged_out)
def got_offline(sender, user, request, **kwargs):
    user.profile.is_online = False
    user.profile.save()
