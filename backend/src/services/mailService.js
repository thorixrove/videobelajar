import "dotenv/config";
import nodemailer from "nodemailer";

// =====================================================================
// Pengiriman email dengan nodemailer (SMTP diatur lewat file .env)
// =====================================================================

const escapeHtml = (text) =>
    String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

let transporter
function getTransporter() {
    if (transporter) return transporter

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
        throw new Error("SMTP_HOST, SMTP_USER, dan SMTP_PASS belum diisi di file .env (lihat .env.example).");
    }

    const port = Number(SMTP_PORT) || 587
    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port,
        secure: port === 465, // 465 = SSL langsung; 587 = STARTTLS
        auth: { user: SMTP_USER, pass: SMTP_PASS }
    })
    return transporter
}

// Menyusun isi email verifikasi (dipisah dari pengiriman supaya mudah diuji).
export function buildVerificationMail({ to, fullname, token }) {
    const baseUrl = (process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`).replace(/\/$/, "")
    const link = `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;

    return {
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to,
        subject: "Verifikasi email akun VideoBelajar",
        text: `Halo ${fullname},\n\nTerima kasih sudah mendaftar. Verifikasi email kamu lewat link berikut:\n${link}\n`,
        html: `<p>Halo ${escapeHtml(fullname)},</p>
<p>Terima kasih sudah mendaftar. Klik tombol di bawah untuk memverifikasi email kamu.</p>
<p><a href="${link}">Verifikasi Email</a></p>
<p>Atau buka link ini: ${link}</p>`,
    }
}

// Mengirim token verifikasi ke email user lewat nodemailer.
export async function sendVerificationEmail({ to, fullname, token }) {
    await getTransporter().sendMail(buildVerificationMail({ to, fullname, token }));
}