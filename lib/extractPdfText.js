// Import langsung ke lib/pdf-parse.js, BUKAN ke root "pdf-parse" — index.js
// package ini punya kode debug yang mengecek `!module.parent` untuk
// mendeteksi "dijalankan langsung", tapi saat dibundel Next.js/webpack
// `module.parent` selalu undefined, jadi kode debug itu ikut jalan dan
// mencoba membaca file test yang tidak ada (`./test/data/*.pdf`),
// membuat build/runtime crash. Import ke lib/pdf-parse.js melewati
// index.js sepenuhnya sehingga kode debug itu tidak pernah dieksekusi.
import pdfParse from "pdf-parse/lib/pdf-parse.js";

/**
 * Mengekstrak teks dari buffer file PDF.
 *
 * Sengaja pakai pdf-parse v1 (bukan v2) — v2 berbasis pdfjs-dist yang
 * butuh polyfill DOMMatrix/canvas native (@napi-rs/canvas) untuk jalan
 * di Node, dan binary native itu tidak konsisten ikut ter-bundle di
 * Vercel serverless function (error "DOMMatrix is not defined" di
 * production meski lolos di lokal). v1 murni JS, tanpa dependensi
 * native, jadi aman di lingkungan serverless mana pun.
 *
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
export async function extractPdfText(buffer) {
  const result = await pdfParse(buffer);
  return (result?.text || "").trim();
}
