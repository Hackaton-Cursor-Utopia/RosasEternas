"""Environment-backed configuration. Secrets never hardcoded."""

from __future__ import annotations

import os
from dataclasses import dataclass


def _bool(value: str | None, default: bool = False) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _float(value: str | None, default: float) -> float:
    if value is None or value.strip() == "":
        return default
    return float(value)


@dataclass(frozen=True)
class Config:
    app_name: str
    demo_mode: bool
    max_amount_mxn: float
    pey_api_key: str
    pey_webhook_secret: str
    pey_api_base: str
    bank_account_id: str | None
    firestore_project_id: str
    google_cloud_project: str

    @classmethod
    def from_env(cls) -> "Config":
        bank = os.getenv("BANK_ACCOUNT_ID", "").strip()
        project = (
            os.getenv("FIRESTORE_PROJECT_ID")
            or os.getenv("GOOGLE_CLOUD_PROJECT")
            or "rosaseternas-mvp"
        )
        return cls(
            app_name=os.getenv("APP_NAME", "Rosas Eternas"),
            demo_mode=_bool(os.getenv("DEMO_MODE"), default=True),
            max_amount_mxn=_float(os.getenv("MAX_AMOUNT_MXN"), 1.00),
            pey_api_key=os.getenv("PEY_API_KEY", ""),
            pey_webhook_secret=os.getenv("PEY_WEBHOOK_SECRET", ""),
            pey_api_base=os.getenv("PEY_API_BASE", "https://api.pey.mx").rstrip("/"),
            bank_account_id=bank or None,
            firestore_project_id=project,
            google_cloud_project=os.getenv("GOOGLE_CLOUD_PROJECT", project),
        )


config = Config.from_env()
