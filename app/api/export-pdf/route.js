import PDFDocument from "pdfkit";

export const runtime = "nodejs";

function sanitizeFilename(name) {
  return (name || "user")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "user";
}

function renderMarkdownLine(doc, rawLine) {
  const line = rawLine.replace(/\*\*/g, "").replace(/`/g, "");

  if (line.startsWith("### ")) {
    doc.moveDown(0.4).fontSize(12).font("Helvetica-Bold").text(line.slice(4)).font("Helvetica").fontSize(10.5);
  } else if (line.startsWith("## ")) {
    doc.moveDown(0.6).fontSize(14).font("Helvetica-Bold").text(line.slice(3)).font("Helvetica").fontSize(10.5);
  } else if (line.startsWith("# ")) {
    doc.moveDown(0.6).fontSize(16).font("Helvetica-Bold").text(line.slice(2)).font("Helvetica").fontSize(10.5);
  } else if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
    doc.text(`•  ${line.trim().slice(2)}`, { indent: 12 });
  } else if (line.trim() === "") {
    doc.moveDown(0.4);
  } else {
    doc.text(line);
  }
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Request tidak valid." }, { status: 400 });
  }

  const { review, namaLengkap } = body || {};
  if (!review || typeof review !== "string") {
    return Response.json({ error: "Tidak ada konten review untuk diexport." }, { status: 400 });
  }

  try {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    const done = new Promise((resolve, reject) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);
    });

    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text(`Hasil Review CV${namaLengkap ? ` — ${namaLengkap}` : ""}`);
    doc.font("Helvetica").fontSize(10.5).moveDown();

    for (const line of review.split("\n")) {
      renderMarkdownLine(doc, line);
    }

    doc.end();
    const pdfBuffer = await done;

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="review-cv-${sanitizeFilename(namaLengkap)}.pdf"`,
      },
    });
  } catch (err) {
    console.error("Gagal membuat PDF hasil review:", err);
    return Response.json({ error: "Gagal membuat file PDF." }, { status: 500 });
  }
}
