import { useId } from "react";
import { LuChevronDown } from "react-icons/lu";
import Field, { fieldClass } from "./Field.jsx";
import { countries } from "../../data/countries.js";

export default function PhoneInput({
  label,
  name,
  value,
  onChange,
  countryIso,
  onCountryChange,
  error,
  required = false,
}) {
  const id = useId();
  const country = countries.find((c) => c.iso === countryIso) ?? countries[0];

  return (
    <Field id={id} label={label} required={required} error={error}>
      <div className="flex gap-3">
        <div className="relative w-[104px] shrink-0 md:w-[100px]">
          <img
            src={`https://flagcdn.com/w40/${country.iso}.png`}
            alt=""
            width="22"
            height="16"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-[22px] -translate-y-1/2 rounded-[2px] bg-gray-100 object-cover"
          />
          <select
            aria-label="Kode negara"
            value={country.iso}
            onChange={(e) => onCountryChange(e.target.value)}
            className={`${fieldClass(false)} appearance-none pl-10 pr-7`}
          >
            {countries.map((c) => (
              <option key={c.iso} value={c.iso}>
                {c.dial}
              </option>
            ))}
          </select>
          <LuChevronDown
            size={14}
            aria-hidden="true"
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500"
          />
        </div>
        <input
          id={id}
          name={name}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={value}
          onChange={onChange}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${fieldClass(error)} min-w-0 flex-1`}
        />
      </div>
    </Field>
  );
}
