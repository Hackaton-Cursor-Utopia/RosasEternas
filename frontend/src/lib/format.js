export const APP_NAME = "Rosas Eternas";
export const QR_EXPIRATION_SECONDS = 900;
export const DEMO_CHARGE_MXN = 0.01;

export function formatMxn(amount) {
  const value = Number(amount);
  if (Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

export function statusLabel(status) {
  const map = {
    pendiente: "Pendiente de pago",
    pagado: "Pagado",
    expirado: "Expirado",
    cancelado: "Cancelado",
  };
  return map[status] || status || "Desconocido";
}

export function isDemoCharge(order) {
  if (!order) return import.meta.env.VITE_DEMO_MODE === "true";
  if (order.demoMode === true) return true;
  if (Number(order.amount) === DEMO_CHARGE_MXN) return true;
  return import.meta.env.VITE_DEMO_MODE === "true";
}

export function expiresAtToDate(expiresAt) {
  if (!expiresAt) return null;
  if (typeof expiresAt.toDate === "function") return expiresAt.toDate();
  if (typeof expiresAt.seconds === "number") {
    return new Date(expiresAt.seconds * 1000);
  }
  const d = new Date(expiresAt);
  return Number.isNaN(d.getTime()) ? null : d;
}
