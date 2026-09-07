import { useCallback, useEffect, useState } from "react";
import { defaultContent, loadContent } from "../lib/content";

export function useContent() {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const next = await loadContent();
      setContent(next);
    } catch (caughtError) {
      console.error("Erro ao carregar o site:", caughtError);
      setError(caughtError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("pinho-content-changed", refresh);
    return () => window.removeEventListener("pinho-content-changed", refresh);
  }, [refresh]);

  return { content, loading, error, refresh };
}
