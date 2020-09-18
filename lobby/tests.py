from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
# from rest_framework.test import APIClient

from django.contrib.auth.models import User
from lobby.serializers import UserSerializer


class TestAllUsers(APITestCase):

    def test_get(self):
        password = 'mypassword'
        my_user1 = User.objects.create_user('myuser1', 'myemail1@test.com', password)
        my_user2 = User.objects.create_user('myuser2', 'myemail2@test.com', password)
        self.url = reverse('all-users')
        user_count = User.objects.count()
        response = self.client.get(self.url)
        self.assertEqual(len(response.data), user_count)
        self.assertEqual(response.status_code, 200)


# class TestCurrentUsers(APITestCase):
#
#     def test_supplier_detail_retrieve(self):
#         response = self.client.get(self.url, HTTP_AUTHORIZATION=self.user_header_employee)
#         get_sup1 = Supplier.objects.get(pk=self.test_supplier.sup_id)
#         serializer = SupplierSerializer(get_sup1)
#         self.assertEqual(response.data, serializer.data)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)