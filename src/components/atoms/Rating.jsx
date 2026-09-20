import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const kind = (value, index) => {
  const diff = value - index;
  if (diff >= 0.75) return "full";
  if (diff >= 0.25) return "half";
  return "empty";
};

const ICONS = { full: FaStar, half: FaStarHalfAlt, empty: FaRegStar };

export default function Rating({ value, reviews }) {
  return (
    <div
      className="flex items-center gap-1.5"
      role="img"
      aria-label={`Rating ${value} dari 5 berdasarkan ${reviews} ulasan`}
    >
      <span className="flex gap-px text-[#ffb400]" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => {
          const Icon = ICONS[kind(value, i)];
          return <Icon key={i} size={12} />;
        })}
      </span>
      <span className="text-xs text-muted underline decoration-dotted underline-offset-2">
        {value.toFixed(1)} ({reviews})
      </span>
    </div>
  );
}
