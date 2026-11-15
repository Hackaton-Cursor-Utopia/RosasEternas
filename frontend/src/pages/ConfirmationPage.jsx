import { Link, useLocation, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { useOrder } from "../hooks/useOrder";
import { APP_NAME, formatMxn, statusLabel } from "../lib/format";

export default function ConfirmationPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const initial = location.state?.order || null;
  const { order, loading, error } = useOrder(orderId, initial);

  const paid = order?.status === "pagado";

  return (
    <Layout>
      <section className="animate-fade-up mx-auto max-w-lg py-8 text-center">
        <p className="font-display text-5xl font-semibold text-chocolate">
          {APP_NAME}
        </p>

        {loading && !order && (
          <p className="mt-10 animate-soft-pulse text-chocolate/60">
            Cargando ticket…
          </p>
        )}

        {error && (
          <p className="mt-6 rounded-sm bg-rose/20 px-4 py-3 text-sm">
            {error}
          </p>
        )}

        {order && (
          <div className="mt-10 border border-sand bg-ivory/70 px-6 py-8 text-left shadow-[0_16px_48px_rgba(73,56,45,0.08)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-chocolate/55">
                  Ticket
                </p>
                <p className="mt-1 font-display text-3xl font-semibold text-chocolate">
                  {paid ? "Pago confirmado" : statusLabel(order.status)}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            <dl className="mt-8 space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-sand pb-2">
                <dt className="text-chocolate/60">Pedido</dt>
                <dd className="font-medium">{order.id || orderId}</dd>
              </div>
              {(order.productName || order.productId) && (
                <div className="flex justify-between gap-4 border-b border-sand pb-2">
                  <dt className="text-chocolate/60">Producto</dt>
                  <dd className="font-medium text-right">
                    {order.productName || order.productId}
                  </dd>
                </div>
              )}
              {order.amount != null && (
                <div className="flex justify-between gap-4 border-b border-sand pb-2">
                  <dt className="text-chocolate/60">Monto cobrado</dt>
                  <dd className="font-medium">{formatMxn(order.amount)}</dd>
                </div>
              )}
              {order.numRef && (
                <div className="flex justify-between gap-4 border-b border-sand pb-2">
                  <dt className="text-chocolate/60">Referencia</dt>
                  <dd className="font-medium">{order.numRef}</dd>
                </div>
              )}
            </dl>

            {paid && (
              <p className="mt-6 text-sm text-cafe">
                Tu ramo está en preparación. Gracias por elegir {APP_NAME}.
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-5 text-sm">
          <Link to="/" className="text-cafe no-underline hover:underline">
            Nuevo pedido
          </Link>
          <Link
            to="/florista"
            className="text-chocolate/60 no-underline hover:underline"
          >
            Ver tablero florista
          </Link>
        </div>
      </section>
    </Layout>
  );
}
