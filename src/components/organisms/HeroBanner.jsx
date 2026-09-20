import Button from "../atoms/Button.jsx";

export default function HeroBanner({ title, description, ctaLabel, ctaHref, image }) {
  return (
    <section className="relative overflow-hidden rounded-xl bg-neutral-900">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 py-12 text-center md:py-20">
        <h1 className="font-heading text-[26px] font-bold leading-tight text-white md:text-[44px] md:leading-[1.15]">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-xs leading-relaxed text-white/90 md:text-sm">
          {description}
        </p>
        <Button as="a" href={ctaHref} className="mt-6 h-10 text-[13px]">
          {ctaLabel}
        </Button>
      </div>
    </section>
  );
}
