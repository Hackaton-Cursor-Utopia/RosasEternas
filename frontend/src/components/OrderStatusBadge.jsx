import { statusLabel } from "../lib/format";

const styles = {
  pendiente: "bg-straw/40 text-chocolate",
  pagado: "bg-rose/35 text-chocolate",
  expirado: "bg-sand text-chocolate/70",
  cancelado: "bg-sand text-chocolate/70",
};

export default function OrderStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-sm px-2.5 py-1 text-xs font-medium uppercase tracking-wide ${
        styles[status] || "bg-sand text-chocolate"
      }`}
    >
      {statusLabel(status)}
    </span>
  );
}
