import "dotenv/config";

// Kunci rahasia dan masa berlaku token dibaca dari file .env.
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET belum diisi di file .env (lihat .env.example).");
}

export const jwtSecret = JWT_SECRET;
export const jwtExpiresIn = JWT_EXPIRES_IN || "1d";