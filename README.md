# Review CV — Dona Talks

Tools untuk mereview CV, dengan hasil revisi yang disesuaikan dengan **role, industri, dan level karier** yang dituju user — bukan review generik. **100% rule-based, tidak ada panggilan API/model AI eksternal apa pun** — semua analisis (pencocokan role, pengecekan keyword, deteksi struktur CV, klasifikasi bullet point) dijalankan sebagai kode di dalam aplikasi.

## Flow

```
Upload CV PDF
      ↓
Isi target role (Nama, Role, Industri, Level Karier, Bahasa CV)
      ↓
Tools mengekstrak & menganalisis isi CV
      ↓
Tools menyesuaikan review dengan role tujuan
      ↓
Hasil review langsung tampil di halaman
      ↓
User download PDF hasil review
```

## Dokumen

- [`docs/input-form.md`](docs/input-form.md) — spesifikasi form input aplikasi (upload CV + data target role user).
- [`docs/review-rules.md`](docs/review-rules.md) — spesifikasi aturan review CV: tabel ~23 kategori role & kompetensi/keyword yang ditonjolkan, logika pencocokan role, dan format output laporan. Implementasi kodenya ada di `lib/roleCategories.js` dan `lib/cvAnalyzer.js` — dokumen ini menjelaskan logikanya, bukan prompt yang dikirim ke AI manapun.

## Menjalankan Aplikasi

Aplikasi dibangun dengan **Next.js (App Router)**. Tidak ada API key atau konfigurasi environment yang perlu diisi — semua analisis jalan lokal.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Jalankan mode development:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000).
3. Untuk build production:
   ```bash
   npm run build
   npm start
   ```

### Struktur Aplikasi

- `app/page.js` — halaman form (upload CV + Nama, Role, Industri, Level Karier, Bahasa CV), langsung menampilkan hasil review begitu selesai diproses, dan tombol download PDF.
- `app/api/review/route.js` — menerima form, ekstrak teks PDF (`pdf-parse`), jalankan `analyzeCv()` (rule-based, lokal), mengembalikan hasil review.
- `app/api/export-pdf/route.js` — mengubah hasil review menjadi file PDF (`pdfkit`) untuk didownload user.
- `lib/roleCategories.js` — data ~23 kategori role beserta alias pencocokan & keyword yang dicek di teks CV.
- `lib/cvAnalyzer.js` — mesin analisis: deteksi bagian CV, klasifikasi bullet point, pengecekan keyword, dan penyusunan laporan markdown.
- `lib/extractPdfText.js` — helper ekstraksi teks dari buffer PDF.

## Status

Aplikasi (form → ekstrak CV → review otomatis rule-based → tampil di halaman → download PDF) sudah berjalan end-to-end tanpa bergantung pada API AI apa pun (Anthropic maupun Gemini sama-sama sudah dilepas). Konsekuensinya: saran yang dihasilkan bersifat pola/checklist berbasis deteksi keyword & struktur, bukan penulisan ulang yang memahami konteks penuh seperti model bahasa. Langkah selanjutnya yang bisa ditambahkan: perluas heuristik deteksi bagian/bullet, dukungan output dwibahasa penuh, autentikasi/riwayat review per user, dan styling lanjutan.
