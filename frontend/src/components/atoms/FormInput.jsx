import { useId, useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import Field, { fieldClass } from "./Field.jsx";

export default function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  ...rest
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <Field id={id} label={label} required={required} error={error}>
      <div className="relative">
        <input
          {...rest}
          id={id}
          name={name}
          type={isPassword && visible ? "text" : type}
          value={value}
          onChange={onChange}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${fieldClass(error)} ${isPassword ? "pr-11" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-gray-500 hover:text-ink"
          >
            {visible ? <LuEye size={18} /> : <LuEyeOff size={18} />}
          </button>
        )}
      </div>
    </Field>
  );
}
