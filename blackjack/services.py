import random

RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']
SUITS = ['♠','♥','♦','♣']

def new_deck():
    deck = [f"{r}{s}" for r in RANKS for s in SUITS]
    random.shuffle(deck)
    return deck

def _rank_of(card: str) -> str:
    """Extrait le rang proprement: 'J♠' -> 'J', '10♥' -> '10'."""
    if not card:
        return ""
    suit = card[-1]
    rank = card[:-1] if suit in SUITS else card
    return rank.strip().upper()

def hand_value(hand: list[str]) -> int:
    """Calcule la valeur d'une main en gérant les As (11 -> 1 si > 21)."""
    total = 0
    aces = 0

    for c in hand:
        r = _rank_of(c)

        if r == 'A':
            total += 11
            aces += 1
        elif r in {'K', 'Q', 'J'}:
            total += 10
        elif r in {'10'}: 
            total += 10
        else:
            try:
                total += int(r)
            except ValueError:
               
                raise ValueError(f"Rang invalide: {r!r} (carte: {c!r})")

    
    while total > 21 and aces > 0:
        total -= 10
        aces -= 1

    return total

def draw(deck: list[str], n: int = 1):
    drawn = [deck.pop() for _ in range(n)]
    return drawn, deck
