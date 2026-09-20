import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import Logo from "../atoms/Logo.jsx";
import FooterColumn from "../molecules/FooterColumn.jsx";
import { footerColumns } from "../../data/navigation.js";

const SOCIALS = [
  { label: "LinkedIn", Icon: FaLinkedinIn },
  { label: "Facebook", Icon: FaFacebookF },
  { label: "Instagram", Icon: FaInstagram },
  { label: "X (Twitter)", Icon: FaXTwitter },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-[1120px] px-4 py-10 md:px-6 md:py-12">
        <div className="grid gap-8 md:grid-cols-[1.2fr_2fr] md:gap-12">
          <div>
            <Logo className="text-2xl" />
            <p className="mt-4 text-sm font-semibold leading-snug">
              Gali Potensi Anda Melalui Pembelajaran Video di hariesok.id!
            </p>
            <address className="mt-3 text-[13px] not-italic leading-relaxed text-muted">
              Jl. Amban Pantai No. 25, Manokwari
              <br />
              +62-812-409-25791
            </address>
          </div>

          <div className="grid gap-0 md:grid-cols-3 md:gap-8">
            {footerColumns.map((column) => (
              <FooterColumn key={column.title} title={column.title} links={column.links} />
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-5 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted">©2023 Toko Monyet Hitam All Rights Reserved.</p>
          <ul className="flex gap-3">
            {SOCIALS.map(({ label, Icon }) => (
              <li key={label}>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label={label}
                  className="flex size-8 items-center justify-center rounded-full border border-line text-ink hover:bg-gray-50"
                >
                  <Icon size={14} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
