const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DIGITS_ONLY = /^\d+$/;

export const isEmail = (value) => EMAIL_PATTERN.test(value.trim());

export function validateEmail(value) {
  if (!value.trim()) return "E-Mail wajib diisi.";
  if (!isEmail(value)) return "Format e-mail belum benar, contoh: nama@email.com.";
  return undefined;
}

export function validateLogin({ email, password }) {
  const errors = {};
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  if (!password) errors.password = "Kata sandi wajib diisi.";
  return errors;
}

export function validateRegister({ name, email, gender, phone, password, confirmPassword }) {
  const errors = {};
  if (!name.trim()) errors.name = "Nama lengkap wajib diisi.";
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  if (!gender) errors.gender = "Pilih jenis kelamin.";
  if (!phone.trim()) errors.phone = "Nomor HP wajib diisi.";
  else if (!DIGITS_ONLY.test(phone) || phone.length < 8 || phone.length > 13)
    errors.phone = "Nomor HP harus berupa 8–13 angka.";
  if (!password) errors.password = "Kata sandi wajib diisi.";
  else if (password.length < 8) errors.password = "Kata sandi minimal 8 karakter.";
  if (!confirmPassword) errors.confirmPassword = "Konfirmasi kata sandi wajib diisi.";
  else if (confirmPassword !== password) errors.confirmPassword = "Konfirmasi kata sandi tidak sama.";
  return errors;
}
