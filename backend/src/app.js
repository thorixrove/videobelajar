import "dotenv/config";
import express from "express";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import courseRoutes from "./routes/courseRoutes.js";

const app = express();

// Membaca body request berformat JSON (dibutuhkan untuk POST dan PATCH).
app.use(express.json());

// Pengecekan cepat bahwa server hidup.
app.get("/", (req, res) => {
  res.json({ message: "API videobelajar berjalan" });
});

// Semua endpoint kelas ada di bawah /course.
app.use("/course", courseRoutes);

// Dua penangan ini harus dipasang paling akhir.
app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

export default app;