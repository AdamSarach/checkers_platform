# import asyncio
# import json
# from django.contrib.auth import get_user_model
# from channels.consumer import AsyncConsumer
# from channels.db import database_sync_to_async
# from .models import Thread, ChatMessage
#
#




import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        user = text_data_json['user']


        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'user': user
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']
        user = event['user']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message,
            'user': user
        }))


class CommunicationConsumer(WebsocketConsumer):
    def connect(self):
        self.communication_name = self.scope['url_route']['kwargs']['client_name']
        self.room_group_name = 'communication_%s' % self.communication_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['data']['message']
        user_sender = text_data_json['userSender']
        receiver = text_data_json['receiver']
        receiver_group_name = 'communication_%s' % receiver

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            receiver_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'user_sender': user_sender,
                'receiver': receiver
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']
        user_sender = event['user_sender']
        receiver = event['receiver']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message,
            'user': user_sender,
            'receiver': receiver
        }))




# class ChatConsumer(WebsocketConsumer):
#     def connect(self):
#         self.accept()
#
#     def disconnect(self, close_code):
#         pass
#
#     def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         message = text_data_json['message']
#
#         self.send(text_data=json.dumps({
#             'message': message
#         }))

