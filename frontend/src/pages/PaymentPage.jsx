import { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Countdown from "../components/Countdown";
import Layout from "../components/Layout";
import OrderStatusBadge from "../components/OrderStatusBadge";
import QrDisplay from "../components/QrDisplay";
import { useOrder } from "../hooks/useOrder";
import {
  DEMO_CHARGE_MXN,
  formatMxn,
  isDemoCharge,
} from "../lib/format";

export default function PaymentPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initial = location.state?.order || null;
  const { order, loading, error, liveSource } = useOrder(orderId, initial);

  useEffect(() => {
    if (order?.status === "pagado") {
      navigate(`/confirmacion/${orderId}`, { replace: true, state: { order } });
    }
  }, [order, orderId, navigate]);

  const qrString = order?.qrString || order?.qr || "";
  const amount = order?.amount ?? order?.chargeAmount;
  const catalogPrice = order?.catalogPriceMxn ?? order?.productPriceMxn;
  const demo = isDemoCharge(order);

  return (
    <Layout>
      <section className="animate-fade-up mx-auto max-w-lg py-4 text-center">
        <p className="font-display text-4xl font-semibold text-chocolate md:text-5xl">
          Pago
        </p>
        <p className="mt-3 text-chocolate/75">
          Escanea el QR con tu app del banco
        </p>

        {loading && !order && (
          <p className="mt-10 animate-soft-pulse text-chocolate/60">
            Cargando pedido…
          </p>
        )}

        {error && (
          <p className="mt-6 rounded-sm bg-rose/20 px-4 py-3 text-sm text-chocolate">
            {error}
          </p>
        )}

        {order && (
          <>
            <div className="mt-8 flex justify-center">
              <OrderStatusBadge status={order.status || "pendiente"} />
            </div>

            <div className="mt-8 flex justify-center">
              <QrDisplay value={qrString} size={280} />
            </div>

            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.18em] text-chocolate/55">
                Monto a pagar
              </p>
              <p className="mt-1 font-display text-5xl font-semibold text-chocolate">
                {formatMxn(amount ?? (demo ? DEMO_CHARGE_MXN : catalogPrice))}
              </p>
              {demo && catalogPrice != null && (
                <p className="mt-2 text-sm text-cafe">
                  Precio de catálogo {formatMxn(catalogPrice)} · cobro demo{" "}
                  {formatMxn(amount ?? DEMO_CHARGE_MXN)}
                </p>
              )}
              {order.productName && (
                <p className="mt-2 text-sm text-chocolate/70">
                  {order.productName}
                  {order.roses ? ` · ${order.roses} rosas` : ""}
                </p>
              )}
            </div>

            <div className="mt-8">
              <Countdown
                expiresAt={order.expiresAt}
                createdAt={order.createdAt}
              />
            </div>

            <p className="mt-8 text-xs text-chocolate/45">
              Pedido {order.id || orderId}
              {liveSource ? ` · en vivo: ${liveSource}` : ""}
            </p>

            <Link
              to="/"
              className="mt-6 inline-block text-sm text-cafe no-underline hover:underline"
            >
              ← Volver al catálogo
            </Link>
          </>
        )}
      </section>
    </Layout>
  );
}
