"""Payment provider interface stub (implemented in Checkpoint 2)."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any


class PaymentProvider(ABC):
    @abstractmethod
    def create_qr(
        self,
        *,
        amount: float,
        concept: str,
        num_ref: str,
        expiration: int = 900,
    ) -> dict[str, Any]:
        raise NotImplementedError


class PeyProvider(PaymentProvider):
    """HTTP client for api.pey.mx — CP2."""

    def create_qr(
        self,
        *,
        amount: float,
        concept: str,
        num_ref: str,
        expiration: int = 900,
    ) -> dict[str, Any]:
        raise NotImplementedError("PeyProvider.create_qr is implemented in Checkpoint 2")
