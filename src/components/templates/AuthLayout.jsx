import Navbar from "../organisms/Navbar.jsx";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar variant="auth" />
      <main className="px-4 py-8 md:py-16">{children}</main>
    </div>
  );
}
