import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  padding: "8px 12px",
  borderRadius: 8,
  textDecoration: "none",
  color: isActive ? "white" : "#c7d1e7",
  background: isActive ? "#2a4a85" : "transparent",
  border: "1px solid #2a4a85",
});

export default function NavBar() {
  return (
    <nav style={{
      display:"flex", gap:10, padding:12, marginBottom:16,
      background:"#0f2040", border:"1px solid #203a6e", borderRadius:10
    }}>
      <NavLink to="/students" style={linkStyle}>Étudiants</NavLink>
      <NavLink to="/blackjack" style={linkStyle}>Blackjack</NavLink>
    </nav>
  );
}
