import { useState } from "react";
import { api } from "../services/api";
import "./Blackjack.css";

const suitColor = (suit) => (suit === "♥" || suit === "♦" ? "red" : "black");
const parseCard = (cardStr) => {
  // ex: "A♠", "10♥", "K♦"
  const suit = cardStr.slice(-1);
  const rank = cardStr.slice(0, -1);
  return { rank, suit, color: suitColor(suit) };
};

const StatusChip = ({ status }) => {
  const map = {
    playing: { text: "En cours", cls: "chip info" },
    player_bust: { text: "Joueur dépassé (Bust)", cls: "chip danger" },
    dealer_bust: { text: "Croupier dépassé (Bust)", cls: "chip success" },
    player_blackjack: { text: "Blackjack Joueur ✨", cls: "chip success" },
    dealer_blackjack: { text: "Blackjack Croupier ✨", cls: "chip danger" },
    player_win: { text: "Victoire Joueur ✅", cls: "chip success" },
    dealer_win: { text: "Victoire Croupier ❌", cls: "chip danger" },
    push: { text: "Égalité (Push)", cls: "chip warn" },
  };
  const d = map[status] ?? { text: status, cls: "chip" };
  return <span className={d.cls}>{d.text}</span>;
};

const Hand = ({ title, cards = [], total }) => (
  <div className="hand">
    <div className="hand-header">
      <h3>{title}</h3>
      <div className="total">Total : <b>{total}</b></div>
    </div>
    <div className="cards">
      {cards.map((c, i) => {
        const { rank, suit, color } = parseCard(c);
        return (
          <div className={`card ${color}`} key={`${c}-${i}`}>
            <div className="corner tl">
              <span className="rank">{rank}</span>
              <span className="suit">{suit}</span>
            </div>
            <div className="center">{suit}</div>
            <div className="corner br">
              <span className="rank">{rank}</span>
              <span className="suit">{suit}</span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default function Blackjack() {
  const [gameId, setGameId] = useState(null);
  const [state, setState] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const start = async () => {
    try {
      setLoading(true);
      const data = await api.post("/blackjack/start/", {});
      setGameId(data.game_id);
      setState(data);
      setErr("");
    } catch (e) {
      setErr(e.message);
    } finally { setLoading(false); }
  };

  const hit = async () => {
    try {
      setLoading(true);
      const data = await api.post("/blackjack/hit/", { game_id: gameId });
      setState(prev => ({ ...prev, ...data }));
    } catch (e) {
      setErr(e.message);
    } finally { setLoading(false); }
  };

  const stand = async () => {
    try {
      setLoading(true);
      const data = await api.post("/blackjack/stand/", { game_id: gameId });
      setState(prev => ({ ...prev, ...data }));
    } catch (e) {
      setErr(e.message);
    } finally { setLoading(false); }
  };

  const resetLocal = () => {
    setGameId(null);
    setState(null);
    setErr("");
  };

  const playing = state?.status === "playing";

  return (
    <div className="bj-container">
      <header className="bj-header">
        <h2>Blackjack</h2>
        {state && <StatusChip status={state.status} />}
      </header>

      {!gameId ? (
        <div className="actions">
          <button className="btn primary" onClick={start} disabled={loading}>
            {loading ? "Démarrage..." : "Nouvelle partie"}
          </button>
        </div>
      ) : (
        <div className="actions">
          <button className="btn" onClick={hit} disabled={!playing || loading}>Tirer</button>
          <button className="btn" onClick={stand} disabled={!playing || loading}>Rester</button>
          <button className="btn ghost" onClick={resetLocal}>Réinitialiser</button>
        </div>
      )}

      {err && <div className="error">{err}</div>}

      {state && (
        <div className="table">
          <Hand title="Joueur" cards={state.player} total={state.player_total} />
          <Hand title="Croupier" cards={state.dealer} total={state.dealer_total} />
        </div>
      )}

      {state && (
        <footer className="bj-footer">
          <div>Cartes restantes : <b>{state.deck_count}</b></div>
        </footer>
      )}
    </div>
  );
}
