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
        if 'userSender' in text_data_json:
            user_sender = text_data_json['userSender']
            receiver = text_data_json['user']
            info = text_data_json['info']
        # message = text_data_json['data']['message']
        # receiver = text_data_json['receiver']
        receiver_group_name = 'communication_%s' % receiver

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            receiver_group_name,
            {
                'type': 'communication_message',
                'user_sender': user_sender,
                'info': info
                # 'receiver': receiver
            }
        )

    # Receive message from room group
    def communication_message(self, event):
        # message = event['message']
        user_sender = event['user_sender']
        # receiver = event['receiver']
        info = event['info']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            # 'message': message,
            'user_sender': user_sender,
            'info': info
            # 'receiver': receiver
        }))



class GameConsumer(WebsocketConsumer):
    def connect(self):
        self.game_name = self.scope['url_route']['kwargs']['game_name']
        self.room_group_name = 'game_%s' % self.game_name

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
        user_sender = text_data_json['userSender']
        receiver = text_data_json['user']
        game_state = text_data_json['gameState']
        turn = text_data_json['turn']
        receiver_group_name = 'game_%s' % receiver

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            receiver_group_name,
            {
                'type': 'game_message',
                'user_sender': user_sender,
                'game_state': game_state,
                'turn': turn
            }
        )

    # Receive message from room group
    def game_message(self, event):
        user_sender = event['user_sender']
        game_state = event['game_state']
        turn = event['turn']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'user_sender': user_sender,
            'game_state': game_state,
            'turn': turn
        }))



