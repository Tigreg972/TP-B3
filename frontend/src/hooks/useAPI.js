import { useEffect, useState } from "react";
import { api } from "../services/api";

export function useAPI(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const d = await api.get(endpoint);
        if (!cancelled) {
          setData(d);
          setError("");
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Erreur");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  return { data, setData, loading, error };
}
