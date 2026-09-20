import { useState } from "react";
import Button from "../atoms/Button.jsx";
import { isEmail } from "../../utils/validators.js";

export default function NewsletterSection({ image }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setError("Masukkan alamat e-mail yang valid.");
      setDone(false);
      return;
    }
    setError("");
    setDone(true);
    setEmail("");
  };

  return (
    <section className="relative overflow-hidden rounded-xl bg-neutral-900">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/75" />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-5 py-10 text-center md:py-14">
        <p className="text-[11px] tracking-[0.2em] text-white/70">NEWSLETTER</p>
        <h2 className="mt-2 font-heading text-2xl font-semibold text-white md:text-[32px]">
          Mau Belajar Lebih Banyak?
        </h2>
        <p className="mt-3 max-w-md text-xs leading-relaxed text-white/80 md:text-sm">
          Daftarkan dirimu untuk mendapatkan informasi terbaru dan penawaran spesial dari program
          terbaik videobelajar disini.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 flex w-full max-w-lg flex-col gap-3 md:flex-row md:gap-0 md:rounded-lg md:bg-white md:p-1.5"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Alamat e-mail
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan Emailmu"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "newsletter-error" : undefined}
            className="h-11 min-w-0 rounded-md bg-white px-3 text-sm text-ink placeholder:text-gray-400 focus:outline-none md:flex-1"
          />
          <Button type="submit" variant="accent" className="md:px-6">
            Subscribe
          </Button>
        </form>

        {error && (
          <p id="newsletter-error" role="alert" className="mt-3 text-xs text-[#ffb8a6]">
            {error}
          </p>
        )}
        {done && (
          <p role="status" className="mt-3 text-xs text-white">
            Terima kasih! Kamu sudah terdaftar di newsletter kami.
          </p>
        )}
      </div>
    </section>
  );
}
