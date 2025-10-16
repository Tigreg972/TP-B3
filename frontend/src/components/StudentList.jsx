import { useState } from "react";
import { useAPI } from "../hooks/useAPI";
import { api } from "../services/api";

export default function StudentList() {
  const { data: students, setData: setStudents, loading, error } = useAPI("/students/");
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "" });
  const [localError, setLocalError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setLocalError("");
    try {
      const created = await api.post("/students/", form);
      setStudents((prev) => (prev ? [created, ...prev] : [created]));
      setForm({ first_name: "", last_name: "", email: "" });
    } catch (e) {
      setLocalError(e.message || "Erreur à la création");
    }
  };

  const handleDelete = async (id) => {
    setLocalError("");
    try {
      await api.del(`/students/${id}/`);
      setStudents((prev) => prev?.filter((s) => s.id !== id) || []);
    } catch (e) {
      setLocalError(e.message || "Erreur à la suppression");
    }
  };

  if (loading) return <p>Chargement…</p>;
  if (error)
    return <p style={{ color: "crimson" }}>Erreur : {error}</p>;

  return (
    <div
      style={{
        maxWidth: 520,
        margin: "2rem auto",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h2>Étudiants</h2>

      <form
        onSubmit={handleCreate}
        style={{ display: "grid", gap: 8, marginBottom: 16 }}
      >
        <input
          placeholder="Prénom"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          required
        />
        <input
          placeholder="Nom"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <button type="submit">Ajouter</button>
      </form>

      {localError && (
        <div style={{ color: "crimson", marginBottom: 8 }}>
          Erreur : {localError}
        </div>
      )}

      {(students ?? []).map((s) => (
        <div
          key={s.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid #ddd",
            padding: "8px 0",
          }}
        >
          <div>
            <strong>
              {s.first_name} {s.last_name}
            </strong>
            <br />
            <small>{s.email}</small>
          </div>
          <button onClick={() => handleDelete(s.id)}>Supprimer</button>
        </div>
      ))}
    </div>
  );
}
