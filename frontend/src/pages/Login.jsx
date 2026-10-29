import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/templates/AuthLayout.jsx";
import AuthCard from "../components/molecules/AuthCard.jsx";
import FormInput from "../components/atoms/FormInput.jsx";
import Button from "../components/atoms/Button.jsx";
import Divider from "../components/atoms/Divider.jsx";
import GoogleButton from "../components/atoms/GoogleButton.jsx";
import { validateLogin } from "../utils/validators.js";

export default function Login() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validateLogin(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) navigate("/");
  };

  return (
    <AuthLayout>
      <AuthCard title="Masuk ke Akun" subtitle="Yuk, lanjutin belajarmu di videobelajar.">
        {state?.registered && (
          <p
            role="status"
            className="mb-4 rounded-md bg-brand-green-soft px-3 py-2 text-center text-xs text-brand-green-dark"
          >
            Akun berhasil dibuat. Silakan masuk.
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
          <FormInput
            label="Kata Sandi"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
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
              Masuk
            </Button>
            <Button as={Link} to="/register" variant="secondary" block>
              Daftar
            </Button>
          </div>

          <Divider />

          <GoogleButton onClick={() => navigate("/")}>Masuk dengan Google</GoogleButton>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
