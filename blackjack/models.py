from django.db import models
from django.utils import timezone

class Game(models.Model):
    """
    Représente une partie de Blackjack persistée.
    On stocke l'état complet en JSON pour garder le code simple (deck, mains, statut).
    """
    created_at = models.DateTimeField(default=timezone.now)
    state = models.JSONField(default=dict)

    def __str__(self):
        s = self.state or {}
        return f"Game #{self.id} [{s.get('status','?')}]"
