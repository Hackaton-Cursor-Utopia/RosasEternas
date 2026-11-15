"""Firestore products collection."""

from __future__ import annotations

from typing import Any

from google.cloud import firestore

from repositories.firestore_client import get_db

COLLECTION = "products"


def upsert_product(product_id: str, data: dict[str, Any]) -> None:
    db = get_db()
    payload = {**data, "updatedAt": firestore.SERVER_TIMESTAMP}
    if "createdAt" not in data:
        payload["createdAt"] = firestore.SERVER_TIMESTAMP
    db.collection(COLLECTION).document(product_id).set(payload, merge=True)


def list_products() -> list[dict[str, Any]]:
    db = get_db()
    docs = db.collection(COLLECTION).stream()
    result: list[dict[str, Any]] = []
    for doc in docs:
        item = doc.to_dict() or {}
        item["id"] = doc.id
        result.append(item)
    return result
