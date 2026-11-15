import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../services/firebase";
import { getOrder } from "../services/api";

/**
 * Live order: prefer Firestore onSnapshot; fall back to API poll every 2s.
 * Status "pagado" only arrives via backend webhook → Firestore.
 */
export function useOrder(orderId, initialOrder = null) {
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(!initialOrder && Boolean(orderId));
  const [error, setError] = useState(null);
  const [liveSource, setLiveSource] = useState(null);

  useEffect(() => {
    if (!orderId) return undefined;

    let cancelled = false;
    let pollId = null;

    if (isFirebaseConfigured && db) {
      setLiveSource("firestore");
      const unsub = onSnapshot(
        doc(db, "orders", orderId),
        (snap) => {
          if (cancelled) return;
          if (!snap.exists()) {
            setError("Pedido no encontrado");
            setLoading(false);
            return;
          }
          setOrder({ id: snap.id, ...snap.data() });
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error("order onSnapshot", err);
          if (!cancelled) {
            setError(err.message || "Error al escuchar el pedido");
            setLiveSource("api-poll");
            startPoll();
          }
        }
      );
      return () => {
        cancelled = true;
        unsub();
        if (pollId) clearInterval(pollId);
      };
    }

    setLiveSource("api-poll");
    startPoll();

    function startPoll() {
      const tick = async () => {
        try {
          const data = await getOrder(orderId);
          if (cancelled) return;
          const normalized = data?.order ? { ...data.order, ...data } : data;
          setOrder(normalized);
          setLoading(false);
          setError(null);
        } catch (err) {
          if (!cancelled) {
            setError(err.message || "Error al consultar el pedido");
            setLoading(false);
          }
        }
      };
      tick();
      pollId = setInterval(tick, 2000);
    }

    return () => {
      cancelled = true;
      if (pollId) clearInterval(pollId);
    };
  }, [orderId]);

  return { order, loading, error, liveSource, setOrder };
}
