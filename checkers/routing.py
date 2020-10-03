# from channels.routing import ProtocolTypeRouter
# from django.conf.urls import url
# from channels.routing import URLRouter
# from channels.auth import AuthMiddlewareStack
# from channels.security.websocket import AllowedHostsOriginValidator, OriginValidator
# from chat.consumers import ChatConsumer
# from django.urls import path, re_path


# application = ProtocolTypeRouter({
#     'websocket': AllowedHostsOriginValidator(
#         AuthMiddlewareStack(
#             URLRouter(
#                 [
#                     re_path(r"^messages/(?P<username>[\w.@+-]+)$", ChatConsumer)
#                 ]
#             )
#         )
#     )
# })

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import chat.routing

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})
