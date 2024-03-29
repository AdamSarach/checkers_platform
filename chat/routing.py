from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer),
    re_path(r'ws/communication/(?P<client_name>\w+)/$', consumers.CommunicationConsumer),
    re_path(r'ws/communication-global/', consumers.CommunicationGlobalConsumer),
    re_path(r'ws/game/(?P<game_name>\w+)/$', consumers.GameConsumer),
]