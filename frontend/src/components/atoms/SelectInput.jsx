import { useId } from "react";
import { LuChevronDown } from "react-icons/lu";
import Field, { fieldClass } from "./Field.jsx";

export default function SelectInput({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
}) {
  const id = useId();
  return (
    <Field id={id} label={label} required={required} error={error}>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${fieldClass(error)} appearance-none pr-10`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <LuChevronDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
      </div>
    </Field>
  );
}
