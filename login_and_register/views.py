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
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken


class NewUserAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreationSerializer
    permission_classes = (AllowAny,)


@api_view(['GET'])
def active_user(request):
    user = get_username_by_token(request)
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)


def get_username_by_token(request):
    token_object = JWTAuthentication()
    header = token_object.get_header(request)
    raw_token = token_object.get_raw_token(header)
    validated_token = token_object.get_validated_token(raw_token)
    return token_object.get_user(validated_token)


class UserList(APIView):

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserListUnsafe(APIView):
    """
    To be removed in production
    """
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_active_users(request):
    # response_list = []
    users_current = User.objects.filter(profile__is_online=True)
    user_list = {"active_users": []}
    for user in users_current:
        user_list["active_users"].append(user.username)
    return Response(user_list, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([])
def get_active_users_unsafe(request):
    """To be deleted in production"""
    response_list = []
    users_current = User.objects.filter(profile__is_online=True)
    serializer = UserSerializer(users_current, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_online(request):

    # try:
    user = get_username_by_token(request)
    # except:
    #     return Response({'message': "Token couldn't be verified."})
    user.profile.is_online = True
    user.profile.save()
    return Response({'test': user.profile.is_online})


@api_view(['GET'])
def get_offline(request):
    """
    Todo - Add token to blacklist
    """
    user = get_username_by_token(request)
    if user == request.user:
        user = User.objects.get(username=request.user)
        user.profile.is_online = False
        user.profile.in_game = False
        user.profile.save()
        return Response(status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def make_in_game(request):

    # try:
    user = get_username_by_token(request)
    # except:
    #     return Response({'message': "Token couldn't be verified."})
    user.profile.in_game = True
    user.profile.save()
    return Response({'is player in game?': user.profile.is_online})


@api_view(['POST'])
def make_out_game(request):

    # try:
    user = get_username_by_token(request)
    # except:
    #     return Response({'message': "Token couldn't be verified."})
    user.profile.in_game = False
    user.profile.save()
    return Response({'is player in game?': user.profile.is_online})


@api_view(['GET'])
def get_in_game_users(request):
    # response_list = []
    users_current = User.objects.filter(profile__in_game=True)
    user_list = {"game_users": []}
    for user in users_current:
        user_list["game_users"].append(user.username)
    return Response(user_list, status=status.HTTP_200_OK)