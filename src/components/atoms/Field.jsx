// Pembungkus label + pesan error untuk semua jenis input.
export default function Field({ id, label, required = false, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] text-muted">
        {label}
        {required && (
          <span className="ml-0.5 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export const fieldClass = (error) =>
  `h-11 w-full rounded-md border bg-white px-3 text-sm text-ink placeholder:text-gray-400 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/25 ${
    error ? "border-red-400" : "border-line"
  }`;
