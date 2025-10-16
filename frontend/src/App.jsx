import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import StudentList from "./components/StudentList";
import Blackjack from "./components/Blackjack";

export default function App() {
  return (
    <div style={{ padding: 20, background:"#0a162a", minHeight:"100vh", color:"white" }}>
      <h1 style={{ marginBottom: 10 }}>Bootcamp Django & React</h1>
      <p style={{ color: "#a9b9d2", marginTop:0 }}>TP complet — Étudiants + Blackjack 🃏</p>

      <NavBar />

      <div style={{ display:"grid", gap:24 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/students" replace />} />
          <Route
            path="/students"
            element={
              <section style={{
                background:"#112241", border:"1px solid #223c6d",
                borderRadius:10, padding:20
              }}>
                <h2>👩‍🎓 Gestion des étudiants</h2>
                <StudentList />
              </section>
            }
          />
          <Route
            path="/blackjack"
            element={
              <section style={{
                background:"#112241", border:"1px solid #223c6d",
                borderRadius:10, padding:20
              }}>
                <h2>🃏 Jeu de Blackjack</h2>
                <Blackjack />
              </section>
            }
          />
          <Route path="*" element={<div>Page introuvable</div>} />
        </Routes>
      </div>
    </div>
  );
}
