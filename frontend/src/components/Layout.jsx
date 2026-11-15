import { Link, NavLink } from "react-router-dom";
import { APP_NAME } from "../lib/format";
import DemoBanner from "./DemoBanner";

const linkClass = ({ isActive }) =>
  `text-sm tracking-wide transition ${
    isActive ? "text-cafe font-semibold" : "text-chocolate/70 hover:text-chocolate"
  }`;

export default function Layout({ children, brandAsHero = false }) {
  return (
    <div className="min-h-screen">
      <DemoBanner />
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-5">
        <Link
          to="/"
          className={`text-chocolate no-underline ${
            brandAsHero
              ? "font-display text-3xl font-semibold tracking-wide md:text-4xl"
              : "font-display text-2xl font-semibold tracking-wide"
          }`}
        >
          {APP_NAME}
        </Link>
        <nav className="flex items-center gap-5">
          <NavLink to="/" end className={linkClass}>
            Catálogo
          </NavLink>
          <NavLink to="/florista" className={linkClass}>
            Florista
          </NavLink>
        </nav>
      </header>
      <div className="mx-auto max-w-5xl px-5 pb-16">{children}</div>
    </div>
  );
}
