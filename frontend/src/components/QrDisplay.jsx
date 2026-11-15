import { QRCodeSVG } from "qrcode.react";

export default function QrDisplay({ value, size = 280 }) {
  if (!value) {
    return (
      <div
        className="flex items-center justify-center bg-sand/60 text-sm text-chocolate/70"
        style={{ width: size, height: size }}
      >
        Generando QR…
      </div>
    );
  }

  return (
    <div className="inline-flex bg-ivory p-4 shadow-[0_12px_40px_rgba(73,56,45,0.12)]">
      <QRCodeSVG
        value={value}
        size={size}
        level="M"
        includeMargin={false}
        bgColor="#F8F3EB"
        fgColor="#49382D"
      />
    </div>
  );
}
