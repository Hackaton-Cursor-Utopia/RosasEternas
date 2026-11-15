# Rosas Eternas

MVP de catálogo y cobro con QR para floristería. Monorepo Flask (Cloud Run) + React (Firebase Hosting).

## Estructura

```
/backend   Flask API (Python 3.12)
/frontend  React + Vite (catálogo → QR → ticket + tablero florista)
```

## Requisitos

- Python 3.12
- Node 20+
- Firebase CLI (`npx -y firebase-tools@latest`)
- Google Cloud SDK (`gcloud`)

## Configuración local

1. Copia `.env.example` → `.env` y completa secretos (nunca commits de `.env`).
2. Backend:

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export $(grep -v '^#' ../.env | xargs)
python -m flask --app app run --port 8080
```

3. Health check: `GET /health` → `{"status":"ok"}`

## Frontend (local)

En otra terminal (Vite hace proxy de `/api` → `http://127.0.0.1:8080`):

```bash
cd frontend
cp .env.example .env   # completa VITE_FIREBASE_* cuando tengas web app config
npm install
npm run dev
```

Abre http://localhost:5173 — catálogo `/`, pago `/pago/:id`, ticket `/confirmacion/:id`, florista `/florista`.

Sin `VITE_FIREBASE_*` el UI usa catálogo seed local y hace poll a la API cada 2s (en lugar de `onSnapshot`).

## Seed de productos

```bash
cd backend
source .venv/bin/activate
python scripts/seed_products.py
```

## Deploy (backend)

```bash
gcloud run deploy rosaseternas-api \
  --source=backend \
  --project=rosaseternas-mvp \
  --region=us-central1 \
  --allow-unauthenticated
```

## Checkpoints

- **CP1** (este): monorepo, `/health`, seed Firestore, Cloud Run URL
- **CP2**: orders + webhook
- **CP3**: UI de pago
- **CP4**: Hosting + README final

Proyecto Firebase/GCP: `rosaseternas-mvp`

## Estado Checkpoint 1

- Monorepo `backend/` + `frontend/` (scaffold)
- `GET /health` → `{"status":"ok"}` (local)
- Firestore `(default)` en `nam5` + `firestore.rules` (client read-only products/orders)
- Seed: 6 productos en colección `products`
- **Bloqueo Cloud Run:** las cuentas de facturación GCP del usuario están `OPEN=False`; hay que abrir/crear billing en [consola](https://console.cloud.google.com/billing/linkedaccount?project=rosaseternas-mvp) y re-desplegar
