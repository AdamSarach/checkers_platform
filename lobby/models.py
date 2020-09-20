from django.db import models

from django.contrib.auth.models import User
from django.core.cache import cache
import datetime
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(User):
    class Meta:
        proxy = True

    def last_seen(self):
        return cache.get('seen_%s' % self.username)

    def online(self):
        if self.last_seen():
            now = datetime.datetime.now()
            if now > self.last_seen() + datetime.timedelta(
                    seconds=settings.USER_ONLINE_TIMEOUT):
                return False
            else:
                return True
        else:
            return False

# class Profile(models.Model):
#     user = models.OneToOneField(User, related_name='profile', on_delete=models.CASCADE)
#
#     def last_seen(self):
#         return cache.get('seen_%s' % self.user.username)
#
#     def online(self):
#         if self.last_seen():
#             now = datetime.datetime.now()
#             if now > self.last_seen() + datetime.timedelta(
#                     seconds=settings.USER_ONLINE_TIMEOUT):
#                 return False
#             else:
#                 return True
#         else:
#             return False


# @receiver(post_save, sender=User)
# def create_user_profile(sender, instance, created, **kwargs):
#     if created:
#         Profile.objects.create(user=instance)
#
#
# @receiver(post_save, sender=User)
# def save_user_profile(sender, instance, **kwargs):
#     instance.profile.save()



