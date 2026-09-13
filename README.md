# Review CV — Dona Talks

Tools untuk mereview CV berbasis AI (Google Gemini), dengan hasil revisi yang disesuaikan dengan **role, industri, dan level karier** yang dituju user — bukan review generik.

## Flow

```
Upload CV PDF
      ↓
Isi target role (Nama, Role, Industri, Level Karier, Bahasa CV)
      ↓
AI membaca isi CV
      ↓
AI menyesuaikan review dengan role tujuan
      ↓
Hasil review jadi lebih spesifik
      ↓
User download PDF hasil review
```

## Dokumen

- [`docs/input-form.md`](docs/input-form.md) — spesifikasi form input aplikasi (upload CV + data target role user).
- [`docs/system-prompt.md`](docs/system-prompt.md) — system prompt AI untuk melakukan review CV, termasuk logika penyesuaian berdasarkan role yang diinginkan (~23 kategori role) dan format output (Ringkasan Eksekutif, Target Role Analysis, dst). File ini dibaca langsung oleh aplikasi sebagai system prompt — mengubah dokumen ini otomatis mengubah perilaku aplikasi.

## Menjalankan Aplikasi

Aplikasi dibangun dengan **Next.js (App Router)**.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Salin `.env.example` menjadi `.env.local` dan isi API key Gemini (gratis, generate di [aistudio.google.com/apikey](https://aistudio.google.com/apikey)):
   ```bash
   cp .env.example .env.local
   # lalu isi GEMINI_API_KEY di .env.local
   ```
3. Jalankan mode development:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000).
4. Untuk build production:
   ```bash
   npm run build
   npm start
   ```

### Struktur Aplikasi

- `app/page.js` — halaman form (upload CV + Nama, Role, Industri, Level Karier, Bahasa CV), langsung menampilkan hasil review begitu selesai diproses, dan tombol download PDF.
- `app/api/review/route.js` — menerima form, ekstrak teks PDF (`pdf-parse`), memanggil Gemini API dengan system prompt dari `docs/system-prompt.md`, mengembalikan hasil review.
- `app/api/export-pdf/route.js` — mengubah hasil review menjadi file PDF (`pdfkit`) untuk didownload user.
- `lib/systemPrompt.js` — memuat `docs/system-prompt.md` sebagai system prompt dan menyusun pesan user untuk AI.
- `lib/extractPdfText.js` — helper ekstraksi teks dari buffer PDF.

## Status

Aplikasi (form → ekstrak CV → review otomatis oleh AI → tampil di halaman → download PDF) sudah berjalan end-to-end memakai Gemini API (gratis via Google AI Studio, tidak butuh API key Anthropic/berbayar). Langkah selanjutnya yang bisa ditambahkan: autentikasi/riwayat review per user, penyimpanan hasil, dan styling lanjutan.
