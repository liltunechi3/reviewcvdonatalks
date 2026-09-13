import { analyzeCv } from "../../../lib/cvAnalyzer";
import { extractPdfText } from "../../../lib/extractPdfText";

// pdf-parse & fs perlu Node.js runtime, bukan Edge.
export const runtime = "nodejs";

export async function POST(req) {
  let formData;
  try {
    formData = await req.formData();
  } catch {
    return Response.json({ error: "Request tidak valid (bukan multipart/form-data)." }, { status: 400 });
  }

  const file = formData.get("cv_file");
  const namaLengkap = String(formData.get("nama_lengkap") || "").trim();
  const roleDiinginkanRaw = String(formData.get("role_diinginkan") || "").trim();
  const industriDituju = String(formData.get("industri_dituju") || "").trim();
  const levelKarier = String(formData.get("level_karier") || "").trim();
  const bahasaCv = String(formData.get("bahasa_cv") || "").trim() || "Indonesia";

  if (!file || typeof file === "string") {
    return Response.json({ error: "Upload CV (PDF) wajib diisi." }, { status: 400 });
  }
  if (!namaLengkap || !industriDituju || !levelKarier || !bahasaCv) {
    return Response.json(
      { error: "Nama Lengkap, Industri yang Dituju, Level Karier, dan Bahasa CV wajib diisi." },
      { status: 400 }
    );
  }

  const roleSpecified = roleDiinginkanRaw.length > 0;
  const roleDiinginkan = roleSpecified ? roleDiinginkanRaw : "Belum spesifik";

  let cvText;
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    cvText = await extractPdfText(buffer);
  } catch (err) {
    console.error("Gagal mengekstrak PDF:", err);
    return Response.json({ error: "Gagal membaca file PDF. Pastikan file tidak rusak." }, { status: 422 });
  }

  if (!cvText) {
    return Response.json(
      { error: "Tidak ada teks yang bisa diekstrak dari PDF (kemungkinan hasil scan gambar tanpa OCR)." },
      { status: 422 }
    );
  }

  // Analisis 100% rule-based, dijalankan lokal — tidak ada panggilan API/AI eksternal.
  const review = analyzeCv({
    namaLengkap,
    roleDiinginkan,
    roleSpecified,
    industriDituju,
    levelKarier,
    bahasaCv,
    cvText,
  });

  return Response.json({
    review,
    meta: { namaLengkap, roleDiinginkan, roleSpecified, industriDituju, levelKarier, bahasaCv },
  });
}
