from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm

from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, UserSerializerWithToken


# Create your views here.


# def start_page(request):
#     context = {}
#     return render(request, 'index.html', context)
#
#
# def get_register_form(request):
#     form = UserCreationForm()
#     context = {'register_form': form}
#     return context
#
#
# def show_register(request):
#     form = UserCreationForm()
#     context = {'register_form': form}
#     return render(request, 'register.html', context)


@api_view(['GET'])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """

    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class UserList(APIView):
    """
    Create a new user. It's called 'UserList' because normally we'd have a get
    method here too, for retrieving a list of all User objects.
    """

    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)