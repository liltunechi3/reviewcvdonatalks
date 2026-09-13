# Review CV — Dona Talks

Tools untuk mereview CV berbasis Claude, dengan hasil revisi yang disesuaikan dengan **role, industri, dan level karier** yang dituju user — bukan review generik.

## Flow

```
Upload CV PDF
      ↓
Isi target role (Nama, Role, Industri, Level Karier, Bahasa CV)
      ↓
Claude membaca isi CV
      ↓
Claude menyesuaikan review dengan role tujuan
      ↓
Hasil review jadi lebih spesifik
      ↓
User download PDF hasil review
```

## Dokumen

- [`docs/input-form.md`](docs/input-form.md) — spesifikasi form input aplikasi (upload CV + data target role user).
- [`docs/system-prompt.md`](docs/system-prompt.md) — system prompt Claude untuk melakukan review CV, termasuk logika penyesuaian berdasarkan role yang diinginkan (~23 kategori role) dan format output (Ringkasan Eksekutif, Target Role Analysis, dst). File ini dibaca langsung oleh aplikasi sebagai system prompt — mengubah dokumen ini otomatis mengubah perilaku aplikasi.

## Menjalankan Aplikasi

Aplikasi dibangun dengan **Next.js (App Router)**.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Salin `.env.example` menjadi `.env.local` dan isi API key Claude:
   ```bash
   cp .env.example .env.local
   # lalu isi ANTHROPIC_API_KEY di .env.local
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

- `app/page.js` — halaman form (upload CV + Nama, Role, Industri, Level Karier, Bahasa CV) dan tampilan hasil review.
- `app/api/review/route.js` — menerima form, ekstrak teks PDF (`pdf-parse`), memanggil Claude API dengan system prompt dari `docs/system-prompt.md`, mengembalikan hasil review.
- `app/api/export-pdf/route.js` — mengubah hasil review menjadi file PDF (`pdfkit`) untuk didownload user.
- `lib/systemPrompt.js` — memuat `docs/system-prompt.md` sebagai system prompt dan menyusun pesan user untuk Claude.
- `lib/extractPdfText.js` — helper ekstraksi teks dari buffer PDF.

## Status

Fondasi aplikasi (form, pemanggilan Claude API, dan export PDF hasil review) sudah berjalan end-to-end. Langkah selanjutnya yang bisa ditambahkan: autentikasi/riwayat review per user, penyimpanan hasil, dan styling lanjutan.
