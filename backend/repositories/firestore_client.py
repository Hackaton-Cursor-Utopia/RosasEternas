"""Shared Firestore client (Admin SDK / ADC)."""

from __future__ import annotations

from google.cloud import firestore

from config import config

_db: firestore.Client | None = None


def get_db() -> firestore.Client:
    global _db
    if _db is None:
        _db = firestore.Client(project=config.firestore_project_id)
    return _db
