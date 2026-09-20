import { useState } from "react";
import { LuLogOut, LuMenu, LuX } from "react-icons/lu";
import Logo from "../atoms/Logo.jsx";
import UserDropdown from "../molecules/UserDropdown.jsx";

// variant="auth": hanya logo (login & registrasi).
// variant="app": logo + Kategori + menu akun (beranda).
export default function Navbar({ variant = "auth", user, menuItems = [], onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isApp = variant === "app";

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white shadow-sm md:shadow-none">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-4 md:h-[72px] md:px-6">
        <Logo className="text-2xl md:text-[26px]" />

        {isApp && (
          <>
            <nav aria-label="Navigasi utama" className="hidden items-center gap-6 md:flex">
              <a href="#koleksi" className="text-sm text-muted hover:text-ink">
                Kategori
              </a>
              <UserDropdown user={user} items={menuItems} onLogout={onLogout} />
            </nav>

            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-controls="menu-mobile"
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
              className="-mr-2 flex size-10 items-center justify-center rounded-md text-ink md:hidden"
            >
              {mobileOpen ? <LuX size={22} /> : <LuMenu size={22} />}
            </button>
          </>
        )}
      </div>

      {isApp && mobileOpen && (
        <nav id="menu-mobile" aria-label="Menu seluler" className="border-t border-line bg-white md:hidden">
          <a
            href="#koleksi"
            onClick={() => setMobileOpen(false)}
            className="block border-b border-line px-4 py-3.5 text-[13px] text-muted"
          >
            Kategori
          </a>
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMobileOpen(false)}
              className="block w-full border-b border-line px-4 py-3.5 text-left text-[13px] text-muted"
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-2 px-4 py-3.5 text-left text-[13px] text-brand-orange"
          >
            Keluar
            <LuLogOut size={16} aria-hidden="true" />
          </button>
        </nav>
      )}
    </header>
  );
}
