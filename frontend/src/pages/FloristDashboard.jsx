import Layout from "../components/Layout";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { useOrders } from "../hooks/useOrders";
import { formatMxn, statusLabel } from "../lib/format";
import { isFirebaseConfigured } from "../services/firebase";

function formatWhen(value) {
  if (!value) return "—";
  let date;
  if (typeof value.toDate === "function") date = value.toDate();
  else if (typeof value.seconds === "number") date = new Date(value.seconds * 1000);
  else date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function FloristDashboard() {
  const { orders, loading, error, liveSource, flashId } = useOrders({
    enableSound: true,
  });

  const paid = orders.filter((o) => o.status === "pagado");
  const pending = orders.filter((o) => o.status === "pendiente");

  return (
    <Layout>
      <section className="animate-fade-up py-4">
        <p className="font-display text-4xl font-semibold text-chocolate md:text-5xl">
          Tablero florista
        </p>
        <p className="mt-3 max-w-xl text-chocolate/75">
          Pedidos en vivo. Cuando llega un pago, verás{" "}
          <strong className="font-medium text-cafe">Pagado – preparar</strong> y
          sonará una alerta.
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-chocolate/60">
          <span>Pagados: {paid.length}</span>
          <span>Pendientes: {pending.length}</span>
          <span>
            En vivo: {liveSource || "—"}
            {!isFirebaseConfigured ? " (sin Firebase web config)" : ""}
          </span>
        </div>

        {error && (
          <p className="mt-4 rounded-sm bg-rose/20 px-4 py-3 text-sm">
            {error}
          </p>
        )}

        {loading ? (
          <p className="mt-10 animate-soft-pulse text-chocolate/60">
            Cargando pedidos…
          </p>
        ) : orders.length === 0 ? (
          <p className="mt-10 text-chocolate/60">Aún no hay pedidos.</p>
        ) : (
          <ul className="mt-8 divide-y divide-sand border-y border-sand">
            {orders.map((order) => {
              const isPaid = order.status === "pagado";
              return (
                <li
                  key={order.id}
                  className={`flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between ${
                    flashId === order.id ? "animate-status-flash" : ""
                  }`}
                >
                  <div>
                    <p className="font-display text-2xl font-semibold text-chocolate">
                      {order.productName || order.productId || "Pedido"}
                    </p>
                    <p className="mt-1 text-sm text-chocolate/60">
                      {order.id} · {formatWhen(order.createdAt || order.paidAt)}
                      {order.amount != null ? ` · ${formatMxn(order.amount)}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {isPaid ? (
                      <span className="text-sm font-semibold uppercase tracking-wide text-cafe">
                        Pagado – preparar
                      </span>
                    ) : (
                      <span className="text-sm text-chocolate/55">
                        {statusLabel(order.status)}
                      </span>
                    )}
                    <OrderStatusBadge status={order.status} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </Layout>
  );
}
