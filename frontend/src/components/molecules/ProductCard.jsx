import { LuPencil, LuTrash2 } from "react-icons/lu";
import Avatar from "../atoms/Avatar.jsx";
import Rating from "../atoms/Rating.jsx";
import Button from "../atoms/Button.jsx";
import { formatPrice } from "../../utils/format.js";


export default function ProductCard({ course, onEdit, onDelete }) {
  const { title, description, image, rating, reviews, price, author } = course;

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-line bg-white">
      <img
        src={image}
        alt=""
        loading="lazy"
        className="aspect-[16/10] w-full object-cover"
      />

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{title}</h3>
        <p className="line-clamp-2 text-[13px] leading-relaxed text-muted">{description}</p>

        <div className="flex items-center gap-2">
          <Avatar src={author.avatar} name={author.name} size={28} />
          <p className="truncate text-xs font-medium">{author.name}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <Rating value={rating} reviews={reviews} />
          <p className="font-heading text-base font-semibold text-brand-green">
            {formatPrice(price)}
          </p>
        </div>

        <div className="mt-2 flex gap-2 border-t border-line pt-3">
          <Button variant="outline" className="flex-1" onClick={() => onEdit(course)}>
            <LuPencil size={14} aria-hidden="true" />
            Edit
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-red-600 hover:bg-red-50"
            onClick={() => onDelete(course.id)}
          >
            <LuTrash2 size={14} aria-hidden="true" />
            Hapus
          </Button>
        </div>
      </div>
    </article>
  );
}