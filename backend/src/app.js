import "dotenv/config";
import express from "express";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import courseRoutes from "./routes/courseRoutes.js";

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
    res.json({ message: "Api videobelajar berjalan"})
})

app.use("/course", courseRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = Number(process.env.PORT) || 3000
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`)
})

export default app