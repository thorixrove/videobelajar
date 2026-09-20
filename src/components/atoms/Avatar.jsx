export default function Avatar({ src, name = "", size = 32, className = "" }) {
  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      style={{ width: size, height: size }}
      className={`shrink-0 rounded-md bg-gray-200 object-cover ${className}`}
    />
  );
}
