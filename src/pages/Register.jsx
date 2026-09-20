import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/templates/AuthLayout.jsx";
import AuthCard from "../components/molecules/AuthCard.jsx";
import FormInput from "../components/atoms/FormInput.jsx";
import SelectInput from "../components/atoms/SelectInput.jsx";
import PhoneInput from "../components/atoms/PhoneInput.jsx";
import Button from "../components/atoms/Button.jsx";
import Divider from "../components/atoms/Divider.jsx";
import GoogleButton from "../components/atoms/GoogleButton.jsx";
import { genderOptions } from "../data/countries.js";
import { validateRegister } from "../utils/validators.js";

const INITIAL = {
  name: "",
  email: "",
  gender: "Wanita",
  countryIso: "id",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleChange = (e) => setField(e.target.name, e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validateRegister(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      navigate("/login", { state: { registered: true } });
    }
  };

  return (
    <AuthLayout>
      <AuthCard title="Pendaftaran Akun" subtitle="Yuk, daftarkan akunmu sekarang juga!">
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormInput
            label="Nama Lengkap"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
          <FormInput
            label="E-Mail"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          <SelectInput
            label="Jenis Kelamin"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            options={genderOptions}
            error={errors.gender}
            required
          />
          <PhoneInput
            label="No. Hp"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            countryIso={form.countryIso}
            onCountryChange={(iso) => setField("countryIso", iso)}
            error={errors.phone}
            required
          />
          <FormInput
            label="Kata Sandi"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          <FormInput
            label="Konfirmasi Kata Sandi"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          <div className="text-right">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-xs text-muted hover:text-ink"
            >
              Lupa Password?
            </a>
          </div>

          <div className="space-y-3 pt-1">
            <Button type="submit" block>
              Daftar
            </Button>
            <Button as={Link} to="/login" variant="secondary" block>
              Masuk
            </Button>
          </div>

          <Divider />

          <GoogleButton onClick={() => navigate("/")}>Daftar dengan Google</GoogleButton>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
