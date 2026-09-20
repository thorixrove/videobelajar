import { useEffect, useRef, useState } from "react";
import { LuLogOut } from "react-icons/lu";
import Avatar from "../atoms/Avatar.jsx";

export default function UserDropdown({ user, items, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Menu akun ${user.name}`}
        className="block rounded-md"
      >
        <Avatar src={user.avatar} name="" size={36} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-48 overflow-hidden rounded-lg border border-line bg-white shadow-lg"
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block w-full border-b border-line px-4 py-3 text-left text-[13px] text-muted hover:bg-gray-50 hover:text-ink"
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            role="menuitem"
            onClick={onLogout}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-[13px] text-brand-orange hover:bg-gray-50"
          >
            Keluar
            <LuLogOut size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
