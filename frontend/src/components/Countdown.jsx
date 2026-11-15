import { useCountdown } from "../hooks/useCountdown";

export default function Countdown({ expiresAt, createdAt }) {
  const { label, expired, secondsLeft } = useCountdown(expiresAt, createdAt);
  const urgent = !expired && secondsLeft <= 60;

  return (
    <div className="text-center">
      <p className="text-xs uppercase tracking-[0.18em] text-chocolate/55">
        Tiempo restante
      </p>
      <p
        className={`mt-1 font-display text-4xl font-semibold tabular-nums ${
          expired
            ? "text-rose"
            : urgent
              ? "animate-soft-pulse text-cafe"
              : "text-chocolate"
        }`}
      >
        {expired ? "00:00" : label}
      </p>
      {expired && (
        <p className="mt-2 text-sm text-rose">
          El QR expiró. Vuelve al catálogo para crear un pedido nuevo.
        </p>
      )}
    </div>
  );
}
