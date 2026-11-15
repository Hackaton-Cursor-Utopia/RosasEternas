import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CatalogPage from "./pages/CatalogPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import FloristDashboard from "./pages/FloristDashboard";
import PaymentPage from "./pages/PaymentPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/pago/:orderId" element={<PaymentPage />} />
        <Route path="/confirmacion/:orderId" element={<ConfirmationPage />} />
        <Route path="/florista" element={<FloristDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
