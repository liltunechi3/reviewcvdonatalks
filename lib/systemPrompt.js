import fs from "node:fs";
import path from "node:path";

let cachedPrompt = null;

/**
 * Membaca docs/system-prompt.md sebagai satu-satunya sumber kebenaran untuk
 * instruksi review CV. Isi file itu sendiri sudah menjelaskan role, aturan
 * penyesuaian berdasarkan target role, dan format output yang diharapkan,
 * jadi dipakai langsung sebagai system prompt untuk model AI (Gemini).
 */
export function getSystemPrompt() {
  if (cachedPrompt) return cachedPrompt;
  const filePath = path.join(process.cwd(), "docs", "system-prompt.md");
  cachedPrompt = fs.readFileSync(filePath, "utf-8");
  return cachedPrompt;
}

export function buildUserMessage({
  namaLengkap,
  roleDiinginkan,
  roleSpecified,
  industriDituju,
  levelKarier,
  bahasaCv,
  cvText,
}) {
  return `Berikut data dari user untuk direview:

- Nama Lengkap: ${namaLengkap}
- Role yang Diinginkan: ${roleDiinginkan}${roleSpecified ? "" : " (role belum spesifik / di-skip user)"}
- Industri yang Dituju: ${industriDituju}
- Level Karier: ${levelKarier}
- Bahasa CV yang Diinginkan: ${bahasaCv}

=== ISI CV (hasil ekstraksi PDF) ===
${cvText}
=== AKHIR ISI CV ===

Lakukan review CV sesuai instruksi system prompt di atas. Tulis seluruh hasil revisi CV dalam Bahasa ${bahasaCv}. Ikuti FORMAT OUTPUT yang ditentukan secara berurutan: Ringkasan Eksekutif, Target Role Analysis, Analisis Per Bagian CV, Revisi Bullet Point (Before → After), Rekomendasi Prioritas, dan Catatan Penutup.`;
}
