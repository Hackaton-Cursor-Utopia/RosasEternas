import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../services/firebase";

/** Fallback catalog when Firebase web config is missing (matches seed). */
const FALLBACK_PRODUCTS = [
  { id: "noche-y-pasion", name: "Noche y Pasión", roses: 13, priceMxn: 383, currency: "MXN", active: true, sortOrder: 1 },
  { id: "bosque-encantado", name: "Bosque Encantado", roses: 12, priceMxn: 348, currency: "MXN", active: true, sortOrder: 2 },
  { id: "lavanda-silvestre", name: "Lavanda Silvestre", roses: 12, priceMxn: 348, currency: "MXN", active: true, sortOrder: 3 },
  { id: "oceano-de-ensueno", name: "Océano de Ensueño", roses: 18, priceMxn: 464, currency: "MXN", active: true, sortOrder: 4 },
  { id: "dulce-cereza", name: "Dulce Cereza", roses: 24, priceMxn: 696, currency: "MXN", active: true, sortOrder: 5 },
  { id: "cafe-toffee", name: "Café Toffee", roses: 12, priceMxn: 348, currency: "MXN", active: true, sortOrder: 6 },
];

export function useProducts() {
  const [products, setProducts] = useState(
    isFirebaseConfigured ? [] : FALLBACK_PRODUCTS
  );
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(
    isFirebaseConfigured ? "firestore" : "fallback"
  );

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setProducts(FALLBACK_PRODUCTS);
      setLoading(false);
      setSource("fallback");
      return undefined;
    }

    const q = query(collection(db, "products"), orderBy("sortOrder", "asc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((p) => p.active !== false);
        setProducts(rows.length ? rows : FALLBACK_PRODUCTS);
        setSource(rows.length ? "firestore" : "fallback");
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("products onSnapshot", err);
        setError(err.message || "No se pudo cargar el catálogo");
        setProducts(FALLBACK_PRODUCTS);
        setSource("fallback");
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  return { products, loading, error, source };
}
