import { formatMxn } from "../lib/format";

export default function ProductCard({ product, onSelect, busyId }) {
  const busy = busyId === product.id;

  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      disabled={Boolean(busyId)}
      className="group w-full border-0 bg-transparent p-0 text-left disabled:opacity-60"
    >
      <div className="relative overflow-hidden rounded-sm">
        <div
          className="aspect-[4/5] w-full transition duration-500 group-hover:scale-[1.02]"
          style={{
            background: `linear-gradient(160deg, #e8d8c3 0%, #c18e8d 48%, #956b52 100%)`,
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-chocolate/55 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-ivory">
          <p className="font-display text-2xl font-semibold leading-tight">
            {product.name}
          </p>
          <p className="mt-1 text-sm text-ivory/85">
            {product.roses} rosas · {formatMxn(product.priceMxn)}
          </p>
        </div>
      </div>
      <span className="mt-3 inline-flex items-center text-sm font-medium text-cafe">
        {busy ? "Creando pedido…" : "Pedir →"}
      </span>
    </button>
  );
}
