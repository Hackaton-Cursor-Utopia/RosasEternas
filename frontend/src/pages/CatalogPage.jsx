import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";
import { APP_NAME, formatMxn, DEMO_CHARGE_MXN } from "../lib/format";
import { createOrder } from "../services/api";
import { isFirebaseConfigured } from "../services/firebase";

export default function CatalogPage() {
  const navigate = useNavigate();
  const { products, loading, error, source } = useProducts();
  const [busyId, setBusyId] = useState(null);
  const [createError, setCreateError] = useState(null);

  async function handleSelect(product) {
    setCreateError(null);
    setBusyId(product.id);
    try {
      const data = await createOrder(product.id);
      const order = data?.order ? { ...data, ...data.order } : data;
      const orderId = order?.id || order?.orderId;
      if (!orderId) throw new Error("La API no devolvió id de pedido");
      navigate(`/pago/${orderId}`, { state: { order } });
    } catch (err) {
      setCreateError(err.message || "No se pudo crear el pedido");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Layout brandAsHero>
      <section className="animate-fade-up pb-10 pt-2 md:pt-6">
        <p className="font-display text-5xl font-semibold leading-none tracking-wide text-chocolate md:text-6xl">
          {APP_NAME}
        </p>
        <p className="mt-4 max-w-xl text-base text-chocolate/75 md:text-lg">
          Ramos eternos, listos para regalar. Elige tu arreglo y paga escaneando
          el QR con tu app del banco.
        </p>
        {import.meta.env.VITE_DEMO_MODE === "true" && (
          <p className="mt-3 text-sm text-cafe">
            Precios de catálogo reales · cobro demo {formatMxn(DEMO_CHARGE_MXN)}
          </p>
        )}
      </section>

      {(error || createError) && (
        <p className="mb-6 rounded-sm bg-rose/20 px-4 py-3 text-sm text-chocolate">
          {createError || error}
        </p>
      )}

      {!isFirebaseConfigured && (
        <p className="mb-4 text-xs text-chocolate/55">
          Firebase web config pendiente — mostrando catálogo local (seed).
        </p>
      )}

      {loading ? (
        <p className="animate-soft-pulse text-chocolate/60">Cargando catálogo…</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <div
              key={product.id}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <ProductCard
                product={product}
                onSelect={handleSelect}
                busyId={busyId}
              />
            </div>
          ))}
        </div>
      )}

      <p className="mt-10 text-xs text-chocolate/45">
        Fuente catálogo: {source}
      </p>
    </Layout>
  );
}
