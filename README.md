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
- [`docs/system-prompt.md`](docs/system-prompt.md) — system prompt Claude untuk melakukan review CV, termasuk logika penyesuaian berdasarkan role yang diinginkan dan format output (Ringkasan Eksekutif, Target Role Analysis, dst).

## Status

Repo ini saat ini berisi spesifikasi produk (form + prompt) sebagai fondasi sebelum implementasi aplikasi (upload PDF, panggil Claude API, generate PDF hasil review) dibangun.
