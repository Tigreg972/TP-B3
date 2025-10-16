from typing import Literal
from ninja import Router, Schema
from django.shortcuts import get_object_or_404
from .models import Game
from .services import new_deck, hand_value, draw

router = Router(tags=["blackjack"])

class StateOut(Schema):
    player: list[str]
    dealer: list[str]
    deck_count: int
    status: Literal[
        "playing","player_bust","dealer_bust",
        "player_blackjack","dealer_blackjack",
        "push","player_win","dealer_win"
    ]
    player_total: int
    dealer_total: int

class StartOut(StateOut):
    game_id: int

class ActionIn(Schema):
    game_id: int

def state_out(state: dict) -> dict:
    return {
        "player": state["player"],
        "dealer": state["dealer"],
        "deck_count": len(state["deck"]),
        "status": state["status"],
        "player_total": hand_value(state["player"]),
        "dealer_total": hand_value(state["dealer"]),
    }

@router.post("/start/", response=StartOut)
def start(request):
    deck = new_deck()
    player, deck = draw(deck, 2)
    dealer, deck = draw(deck, 2)
    p, d = hand_value(player), hand_value(dealer)
    if p == 21 and d == 21: status = "push"
    elif p == 21:           status = "player_blackjack"
    elif d == 21:           status = "dealer_blackjack"
    else:                   status = "playing"
    g = Game.objects.create(state={"player":player,"dealer":dealer,"deck":deck,"status":status})
    return {"game_id": g.id, **state_out(g.state)}

@router.post("/hit/", response=StateOut)
def hit(request, payload: ActionIn):
    g = get_object_or_404(Game, id=payload.game_id)
    st = g.state
    if st["status"] != "playing":
        return state_out(st)
    card, st["deck"] = draw(st["deck"], 1)
    st["player"] += card
    if hand_value(st["player"]) > 21:
        st["status"] = "player_bust"
    g.state = st; g.save(update_fields=["state"])
    return state_out(st)

@router.post("/stand/", response=StateOut)
def stand(request, payload: ActionIn):
    g = get_object_or_404(Game, id=payload.game_id)
    st = g.state
    while hand_value(st["dealer"]) < 17 and st["status"] == "playing":
        card, st["deck"] = draw(st["deck"], 1)
        st["dealer"] += card
        if hand_value(st["dealer"]) > 21:
            st["status"] = "dealer_bust"
    p, d = hand_value(st["player"]), hand_value(st["dealer"])
    if st["status"] == "playing":
        if d > p:   st["status"] = "dealer_win"
        elif d < p: st["status"] = "player_win"
        else:       st["status"] = "push"
    g.state = st; g.save(update_fields=["state"])
    return state_out(st)

@router.get("/state/{game_id}/", response=StateOut)
def state(request, game_id: int):
    g = get_object_or_404(Game, id=game_id)
    return state_out(g.state)
