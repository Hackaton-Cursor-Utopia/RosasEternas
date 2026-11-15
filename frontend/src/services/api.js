const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }

  if (!response.ok) {
    const message =
      data?.error || data?.message || `Error ${response.status} en ${path}`;
    const err = new Error(message);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

/** POST /api/orders { productId } → order + qrString + amount + expiresAt/status */
export function createOrder(productId) {
  return request("/api/orders", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
}

/** GET /api/orders */
export function listOrders() {
  return request("/api/orders");
}

/** GET /api/orders/:id */
export function getOrder(orderId) {
  return request(`/api/orders/${encodeURIComponent(orderId)}`);
}
