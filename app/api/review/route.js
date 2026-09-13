import { GoogleGenAI } from "@google/genai";
import { extractPdfText } from "../../../lib/extractPdfText";
import { buildUserMessage, getSystemPrompt } from "../../../lib/systemPrompt";

// pdf-parse & fs perlu Node.js runtime, bukan Edge.
export const runtime = "nodejs";

const DEFAULT_MODEL = "gemini-2.5-flash";

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

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "GEMINI_API_KEY belum dikonfigurasi di server." }, { status: 500 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
      contents: buildUserMessage({
        namaLengkap,
        roleDiinginkan,
        roleSpecified,
        industriDituju,
        levelKarier,
        bahasaCv,
        cvText,
      }),
      config: {
        systemInstruction: getSystemPrompt(),
      },
    });

    const review = (response.text || "").trim();
    if (!review) {
      return Response.json({ error: "Model tidak mengembalikan hasil review. Coba lagi." }, { status: 502 });
    }

    return Response.json({
      review,
      meta: { namaLengkap, roleDiinginkan, roleSpecified, industriDituju, levelKarier, bahasaCv },
    });
  } catch (err) {
    console.error("Gagal memanggil Gemini API:", err);
    return Response.json({ error: "Gagal memproses review lewat Gemini API. Coba lagi sebentar lagi." }, { status: 502 });
  }
}
