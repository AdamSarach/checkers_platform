from django.shortcuts import render

# Create your views here.
from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import UserSerializer


# @api_view(['GET'])
# @permission_classes([])
# def get_current_users(request):
#     active_sessions = Session.objects.filter(expire_date__gte=timezone.now())
#     user_id_list = []
#     for session in active_sessions:
#         data = session.get_decoded()
#         user_id_list.append(data.get('_auth_user_id', None))
#         users = User.objects.filter(id__in=user_id_list)
#     # Query all logged in users based on id list
#     users_serializer = UserSerializer(users, many=True)
#     return Response(users_serializer.data)

from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from django.utils import timezone

def xget_current_users():
    active_sessions = Session.objects.filter(expire_date__gte=timezone.now())
    user_id_list = []
    for session in active_sessions:
        data = session.get_decoded()
        user_id_list.append(data.get('_auth_user_id', None))
    # Query all logged in users based on id list
    return User.objects.filter(id__in=user_id_list)


from rest_framework import generics, permissions


class get_current_users(generics.ListCreateAPIView):
    permission_classes = ()
    queryset = xget_current_users()
    serializer_class = UserSerializer


@api_view(['GET'])
@permission_classes([])
def get_all_users(request):
    """
    Determine the current user by their token, and return their data
    """
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)




