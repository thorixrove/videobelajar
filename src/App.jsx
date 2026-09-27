import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import SemuaProduk from "./pages/SemuaProduk.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/produk" element={<SemuaProduk/>}/>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
