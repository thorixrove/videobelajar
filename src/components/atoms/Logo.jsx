import { Link } from "react-router-dom";

export default function Logo({ to = "/", className = "" }) {
  return (
    <Link
      to={to}
      aria-label="videobelajar, kembali ke beranda"
      className={`inline-block bg-linear-to-r from-brand-yellow from-40% to-brand-orange bg-clip-text font-heading font-semibold tracking-tight text-transparent ${className}`}
    >
      videobelajar
    </Link>
  );
}
