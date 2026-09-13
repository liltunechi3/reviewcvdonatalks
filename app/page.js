"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

const ROLE_OPTIONS = [
  "Management Trainee",
  "Digital Marketing Specialist",
  "Social Media Specialist",
  "Business Development / Sales",
  "HR Staff",
  "IT / Software Engineer",
  "Data Analyst / Data Scientist",
  "IT Support / System Administrator",
  "UI/UX Designer",
  "Product Manager",
  "Project Manager",
  "QA Engineer",
  "Finance / Accounting Staff",
  "Operations / Supply Chain",
  "Customer Service",
  "Admin / Office Support",
  "Content Writer / Copywriter",
  "Legal / Compliance",
  "Procurement",
  "Guru / Trainer",
  "Tenaga Medis",
  "Retail / Store Staff",
  "Engineering (Civil/Mechanical/Electrical)",
  "Consultant",
  "Lainnya",
  "Skip / Belum pasti",
];

const LEVEL_OPTIONS = ["Fresh Graduate", "Entry Level", "Junior", "Mid Level", "Career Switcher"];

const initialFormState = {
  namaLengkap: "",
  role: "",
  roleCustom: "",
  industri: "",
  level: LEVEL_OPTIONS[0],
  bahasa: "Indonesia",
};

export default function HomePage() {
  const [file, setFile] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!file) {
      setError("Upload CV (PDF) terlebih dahulu.");
      return;
    }
    if (!form.namaLengkap.trim() || !form.industri.trim() || !form.level || !form.bahasa) {
      setError("Nama Lengkap, Industri yang Dituju, Level Karier, dan Bahasa CV wajib diisi.");
      return;
    }

    let roleValue = form.role;
    if (form.role === "Lainnya") {
      roleValue = form.roleCustom.trim();
    } else if (form.role === "Skip / Belum pasti") {
      roleValue = "";
    }

    const formData = new FormData();
    formData.append("cv_file", file);
    formData.append("nama_lengkap", form.namaLengkap.trim());
    formData.append("role_diinginkan", roleValue);
    formData.append("industri_dituju", form.industri.trim());
    formData.append("level_karier", form.level);
    formData.append("bahasa_cv", form.bahasa);

    setLoading(true);
    try {
      const res = await fetch("/api/review", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Terjadi kesalahan saat memproses CV.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Gagal terhubung ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadPdf() {
    if (!result) return;
    setError("");
    setDownloading(true);
    try {
      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review: result.review, namaLengkap: result.meta.namaLengkap }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Gagal membuat PDF.");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `review-cv-${result.meta.namaLengkap || "user"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Gagal mendownload PDF hasil review.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <main className="container">
      <h1>Review CV — Dona Talks</h1>
      <p className="subtitle">
        Upload CV kamu dan isi target karier, tools ini akan menganalisis CV-mu (100% rule-based, tanpa
        AI) supaya lebih cocok dengan role, industri, dan level karier yang kamu tuju — bukan review
        generik.
      </p>

      <form onSubmit={handleSubmit} className="form">
        <label>
          Upload CV (PDF)
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>

        <label>
          Nama Lengkap
          <input
            type="text"
            value={form.namaLengkap}
            onChange={(e) => updateField("namaLengkap", e.target.value)}
            placeholder="Dona Arifah"
          />
        </label>

        <label>
          Role yang Diinginkan
          <select value={form.role} onChange={(e) => updateField("role", e.target.value)}>
            <option value="">-- Pilih role --</option>
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>

        {form.role === "Lainnya" && (
          <label>
            Tulis Role yang Dituju
            <input
              type="text"
              value={form.roleCustom}
              onChange={(e) => updateField("roleCustom", e.target.value)}
              placeholder="Misal: Investment Analyst"
            />
          </label>
        )}

        <label>
          Industri yang Dituju
          <input
            type="text"
            value={form.industri}
            onChange={(e) => updateField("industri", e.target.value)}
            placeholder="FMCG, Property, Agency, Startup, Banking, Education, dll."
          />
        </label>

        <label>
          Level Karier
          <select value={form.level} onChange={(e) => updateField("level", e.target.value)}>
            {LEVEL_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>

        <label>
          Bahasa CV yang Diinginkan
          <select value={form.bahasa} onChange={(e) => updateField("bahasa", e.target.value)}>
            <option value="Indonesia">Indonesia</option>
            <option value="English">English</option>
          </select>
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Memproses review..." : "Review CV Saya"}
        </button>
      </form>

      {result && (
        <section className="result">
          <div className="result-header">
            <h2>Hasil Review</h2>
            <button onClick={handleDownloadPdf} disabled={downloading}>
              {downloading ? "Menyiapkan PDF..." : "Download PDF"}
            </button>
          </div>
          <article className="markdown">
            <ReactMarkdown>{result.review}</ReactMarkdown>
          </article>
        </section>
      )}
    </main>
  );
}
