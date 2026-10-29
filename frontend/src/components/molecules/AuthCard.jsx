export default function AuthCard({ title, subtitle, children }) {
  return (
    <section className="mx-auto w-full max-w-[480px] rounded-lg border border-line bg-white p-5 shadow-sm md:p-8">
      <h1 className="text-center font-heading text-xl font-semibold md:text-[26px]">{title}</h1>
      <p className="mt-1.5 text-center text-xs text-muted md:text-sm">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}
