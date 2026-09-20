import Avatar from "../atoms/Avatar.jsx";
import Rating from "../atoms/Rating.jsx";
import { formatPrice } from "../../utils/format.js";

// Mobile: gambar di kiri, teks di kanan. Desktop (md+): kartu vertikal.
export default function CourseCard({ course }) {
  const { title, description, image, rating, reviews, price, author } = course;

  return (
    <article className="flex gap-3 rounded-lg border border-line bg-white p-3 md:flex-col md:gap-4 md:p-4">
      <img
        src={image}
        alt=""
        loading="lazy"
        className="h-[92px] w-[92px] shrink-0 rounded-md bg-gray-200 object-cover md:aspect-[16/10] md:h-auto md:w-full"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug md:text-base">{title}</h3>
        <p className="hidden line-clamp-2 text-[13px] leading-relaxed text-muted md:block">
          {description}
        </p>

        <div className="flex items-center gap-2">
          <Avatar src={author.avatar} name={author.name} size={32} />
          <div className="min-w-0">
            <p className="truncate text-xs font-medium">{author.name}</p>
            <p className="truncate text-[11px] text-muted">{author.role}</p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <Rating value={rating} reviews={reviews} />
          <p className="font-heading text-base font-semibold text-brand-green md:text-xl">
            {formatPrice(price)}
          </p>
        </div>
      </div>
    </article>
  );
}
