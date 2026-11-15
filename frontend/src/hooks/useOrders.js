import { useEffect, useRef, useState } from "react";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../services/firebase";
import { listOrders } from "../services/api";

function normalizeOrders(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.orders)) return payload.orders;
  return [];
}

function playAlert() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    /* ignore autoplay restrictions */
  }
}

/**
 * Live orders list for florist dashboard.
 * Alerts when a new order appears with status pagado.
 */
export function useOrders({ enableSound = true } = {}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveSource, setLiveSource] = useState(null);
  const [flashId, setFlashId] = useState(null);
  const knownPaid = useRef(new Set());
  const primed = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let pollId = null;

    const applyOrders = (rows) => {
      const sorted = [...rows].sort((a, b) => {
        const ta = a.createdAt?.seconds ?? (Date.parse(a.createdAt || 0) || 0);
        const tb = b.createdAt?.seconds ?? (Date.parse(b.createdAt || 0) || 0);
        return tb - ta;
      });

      if (primed.current && enableSound) {
        for (const o of sorted) {
          if (o.status === "pagado" && !knownPaid.current.has(o.id)) {
            playAlert();
            setFlashId(o.id);
            setTimeout(() => setFlashId((cur) => (cur === o.id ? null : cur)), 1600);
          }
        }
      }

      knownPaid.current = new Set(
        sorted.filter((o) => o.status === "pagado").map((o) => o.id)
      );
      primed.current = true;
      setOrders(sorted);
      setLoading(false);
      setError(null);
    };

    if (isFirebaseConfigured && db) {
      setLiveSource("firestore");
      const q = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc"),
        limit(50)
      );
      const unsub = onSnapshot(
        q,
        (snap) => {
          if (cancelled) return;
          applyOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        },
        (err) => {
          console.error("orders onSnapshot", err);
          if (!cancelled) {
            setError(err.message || "Error al escuchar pedidos");
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
          const data = await listOrders();
          if (cancelled) return;
          applyOrders(normalizeOrders(data));
        } catch (err) {
          if (!cancelled) {
            setError(err.message || "Error al listar pedidos");
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
  }, [enableSound]);

  return { orders, loading, error, liveSource, flashId };
}
