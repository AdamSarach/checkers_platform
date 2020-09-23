from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
# from rest_framework.test import APIClient

from django.contrib.auth.models import User
from login_and_register.models import Profile
from login_and_register.serializers import UserSerializer


class TestRegisterUser(APITestCase):

    def test_create(self):
        password = 'mypassword'
        username = 'my_test_user_1'
        self.url = reverse('new-user')
        response = self.client.post(self.url, data={'username': username, 'password': password}, format='json')
        self.assertEqual(response.status_code, 201)

    def test_create_invalid(self):
        password = 'mypassword'
        username = 'my_test_user_1'
        my_user1 = User.objects.create_user(username=username, password=password)
        self.url = reverse('new-user')
        response = self.client.post(self.url, data={'username': username, 'password': password}, format='json')
        self.assertEqual(response.status_code, 400)


class TestUserList(APITestCase):

    def test_get_userlist_unsafe(self):
        """
        To be removed in production
        """
        password = 'mypassword'
        username = 'my_test_user_1'
        username2 = 'my_test_user_2'
        my_user1 = User.objects.create_user(username=username, password=password)
        my_user2 = User.objects.create_user(username=username2, password=password)
        self.url = reverse('get-all-users-unsafe')
        response = self.client.get(self.url)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_userlist(self):

        password = 'mypassword'
        username = 'my_test_user_1'
        username2 = 'my_test_user_2'
        my_user1 = User.objects.create_user(username=username, password=password)
        my_user2 = User.objects.create_user(username=username2, password=password)

        self.url_token = reverse('token')
        self.user_token_emp = self.client.post(
            self.url_token,
            data={'username': username, 'password': password}).data['access']
        self.user_header = 'Bearer ' + self.user_token_emp
        self.url = reverse('get-all-users')
        response = self.client.get(self.url, HTTP_AUTHORIZATION=self.user_header)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TestNameByToken(APITestCase):
    def test_get(self):

        password = 'mypassword'
        username = 'my_test_user_1'
        my_user1 = User.objects.create_user(username=username, password=password)
        self.url_token = reverse('token')
        self.user_token_emp = self.client.post(
            self.url_token,
            data={'username': username, 'password': password}).data['access']
        self.user_header = 'Bearer ' + self.user_token_emp
        self.url = reverse('active-user')
        response = self.client.get(self.url, HTTP_AUTHORIZATION=self.user_header)
        self.assertEqual(response.data, {'username': username})
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TestActiveUsers(APITestCase):
    def test_user_logged_in(self):
        password = 'mypassword'
        username = 'my_test_user_1'
        my_user1 = User.objects.create_user(username=username, password=password)
        self.url_token = reverse('token')
        self.user_token_emp = self.client.post(
            self.url_token,
            data={'username': username, 'password': password}).data['access']
        self.user_header = 'Bearer ' + self.user_token_emp
        self.url = reverse('get-online')
        response = self.client.get(self.url, HTTP_AUTHORIZATION=self.user_header)
        user = User.objects.get(username=username)
        self.assertEqual(user.profile.is_online, True)


class TestActiveUsers(APITestCase):
    def test_user_logged_out(self):
        password = 'mypassword'
        username = 'my_test_user_1'
        my_user1 = User.objects.create_user(username=username, password=password)
        self.url_token = reverse('token')
        self.user_token_emp = self.client.post(
            self.url_token,
            data={'username': username, 'password': password}).data['access']
        self.user_header = 'Bearer ' + self.user_token_emp
        self.url = reverse('get-online')
        response = self.client.get(self.url, HTTP_AUTHORIZATION=self.user_header)
        self.url_offline = reverse('get-offline')
        response = self.client.get(self.url_offline, HTTP_AUTHORIZATION=self.user_header)
        user = User.objects.get(username=username)
        self.assertEqual(user.profile.is_online, False)

