"""Seed 6 catalog products into Firestore `products` collection."""

from __future__ import annotations

import os
import sys

# Allow imports from backend root when run as script
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from repositories.products_repository import list_products, upsert_product

# Catalog from Catalogo.xlsx (prices with IVA). Slugs are stable document IDs.
PRODUCTS = [
    {
        "id": "noche-y-pasion",
        "name": "Noche y Pasión",
        "roses": 13,
        "priceMxn": 383,
        "currency": "MXN",
        "active": True,
        "sortOrder": 1,
    },
    {
        "id": "bosque-encantado",
        "name": "Bosque Encantado",
        "roses": 12,
        "priceMxn": 348,
        "currency": "MXN",
        "active": True,
        "sortOrder": 2,
    },
    {
        "id": "lavanda-silvestre",
        "name": "Lavanda Silvestre",
        "roses": 12,
        "priceMxn": 348,
        "currency": "MXN",
        "active": True,
        "sortOrder": 3,
    },
    {
        "id": "oceano-de-ensueno",
        "name": "Océano de Ensueño",
        "roses": 18,
        "priceMxn": 464,
        "currency": "MXN",
        "active": True,
        "sortOrder": 4,
    },
    {
        "id": "dulce-cereza",
        "name": "Dulce Cereza",
        "roses": 24,
        "priceMxn": 696,
        "currency": "MXN",
        "active": True,
        "sortOrder": 5,
    },
    {
        "id": "cafe-toffee",
        "name": "Café Toffee",
        "roses": 12,
        "priceMxn": 348,
        "currency": "MXN",
        "active": True,
        "sortOrder": 6,
    },
]


def main() -> None:
    for product in PRODUCTS:
        product_id = product["id"]
        data = {k: v for k, v in product.items() if k != "id"}
        upsert_product(product_id, data)
        print(f"upserted {product_id}: {data['name']} — {data['roses']} rosas — {data['priceMxn']}")

    count = len(list_products())
    print(f"done. products in Firestore: {count}")


if __name__ == "__main__":
    main()
