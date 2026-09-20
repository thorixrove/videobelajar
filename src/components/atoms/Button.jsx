const VARIANTS = {
  primary: "bg-brand-green text-white hover:bg-brand-green-dark",
  secondary: "bg-brand-green-soft text-brand-green-dark hover:bg-[#d8f4d2]",
  outline: "border border-line bg-white text-ink hover:bg-gray-50",
  accent: "bg-brand-yellow text-white hover:brightness-95",
};

// Tombol reusable: variasi tampilan dipilih lewat props `variant`.
// Gunakan `as="a"` untuk tampilan tombol pada tautan.
export default function Button({
  as: Component = "button",
  variant = "primary",
  block = false,
  className = "",
  children,
  ...rest
}) {
  const typeProps = Component === "button" ? { type: rest.type ?? "button" } : {};
  return (
    <Component
      {...rest}
      {...typeProps}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-colors ${
        block ? "w-full" : ""
      } ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </Component>
  );
}
