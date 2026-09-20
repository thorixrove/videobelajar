import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

// Mobile: accordion. Desktop (md+): daftar tautan selalu tampil.
export default function FooterColumn({ title, links }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-line md:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3.5 text-left text-sm font-semibold md:pointer-events-none md:mb-3 md:py-0"
      >
        {title}
        <LuChevronDown
          size={18}
          aria-hidden="true"
          className={`transition-transform md:hidden ${open ? "rotate-180" : ""}`}
        />
      </button>
      <ul className={`space-y-2.5 pb-4 md:block md:pb-0 ${open ? "block" : "hidden"}`}>
        {links.map((label) => (
          <li key={label}>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-[13px] text-muted hover:text-ink"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
