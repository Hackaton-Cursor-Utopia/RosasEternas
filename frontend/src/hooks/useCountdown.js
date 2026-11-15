import { useEffect, useState } from "react";
import { expiresAtToDate, QR_EXPIRATION_SECONDS } from "../lib/format";

function remainingSeconds(expiresAt, createdAt) {
  const end = expiresAtToDate(expiresAt);
  if (end) {
    return Math.max(0, Math.floor((end.getTime() - Date.now()) / 1000));
  }
  const start = expiresAtToDate(createdAt);
  if (start) {
    const endMs = start.getTime() + QR_EXPIRATION_SECONDS * 1000;
    return Math.max(0, Math.floor((endMs - Date.now()) / 1000));
  }
  return QR_EXPIRATION_SECONDS;
}

export function useCountdown(expiresAt, createdAt) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    remainingSeconds(expiresAt, createdAt)
  );

  useEffect(() => {
    setSecondsLeft(remainingSeconds(expiresAt, createdAt));
    const id = setInterval(() => {
      setSecondsLeft(remainingSeconds(expiresAt, createdAt));
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt, createdAt]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const label = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return { secondsLeft, label, expired: secondsLeft <= 0 };
}
