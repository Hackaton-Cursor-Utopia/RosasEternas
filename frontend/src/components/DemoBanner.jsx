import { DEMO_CHARGE_MXN, formatMxn } from "../lib/format";

export default function DemoBanner() {
  if (import.meta.env.VITE_DEMO_MODE !== "true") return null;

  return (
    <div
      role="status"
      className="border-b border-straw/60 bg-straw/35 px-4 py-2 text-center text-sm text-chocolate"
    >
      Modo demo: el catálogo muestra precios reales; el cobro es{" "}
      <strong>{formatMxn(DEMO_CHARGE_MXN)}</strong>.
    </div>
  );
}
