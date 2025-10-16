import random

RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']
SUITS = ['♠','♥','♦','♣']

def new_deck():
    deck = [f"{r}{s}" for r in RANKS for s in SUITS]
    random.shuffle(deck)
    return deck

def hand_value(hand: list[str]) -> int:
    vals = []
    for c in hand:
        r = c[:-1]
        vals.append({'A':11,'K':10,'Q':10,'J':10}.get(r, int(r)))
    total = sum(vals)
    aces = sum(1 for c in hand if c[:-1] == 'A')
    while total > 21 and aces:
        total -= 10
        aces -= 1
    return total

def draw(deck: list[str], n: int = 1):
    drawn = [deck.pop() for _ in range(n)]
    return drawn, deck
