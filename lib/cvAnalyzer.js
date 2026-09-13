import { FALLBACK_KEYWORDS, matchRoleCategory } from "./roleCategories";

const SECTION_HEADER_PATTERNS = [
  { key: "ringkasan", pattern: /^(ringkasan|profil|about me|summary|professional summary|objective|tentang saya)\b/i },
  { key: "pengalaman", pattern: /^(pengalaman( kerja)?|work experience|experience|riwayat pekerjaan|employment history)\b/i },
  { key: "pendidikan", pattern: /^(pendidikan|education|riwayat pendidikan)\b/i },
  { key: "skill", pattern: /^(skill|keahlian|kemampuan|technical skills|kompetensi|hard skill|soft skill)\b/i },
  { key: "organisasi", pattern: /^(organisasi|organizational experience|kegiatan|volunteer|pengalaman organisasi)\b/i },
  { key: "sertifikasi", pattern: /^(sertifikasi|certifications?|penghargaan|awards?)\b/i },
];

const ID_ACTION_VERBS = [
  "memimpin", "mengelola", "mengembangkan", "meningkatkan", "menurunkan", "mengurangi",
  "merancang", "membangun", "menciptakan", "mengimplementasikan", "menerapkan",
  "mengoptimalkan", "menyusun", "melatih", "menegosiasikan", "memfasilitasi",
  "mengawasi", "memonitor", "mencapai", "menyelesaikan", "mengoordinasikan",
  "menganalisis", "mendesain", "meluncurkan", "menghasilkan", "menghemat",
  "memperluas", "menjalankan", "merencanakan", "mengevaluasi",
];

const EN_ACTION_VERBS = [
  "led", "managed", "developed", "increased", "decreased", "reduced", "designed",
  "built", "created", "implemented", "optimized", "coordinated", "achieved",
  "launched", "analyzed", "negotiated", "trained", "supervised", "delivered",
  "generated", "improved", "established", "executed", "facilitated", "initiated",
  "spearheaded", "streamlined",
];

const WEAK_OPENING_PATTERNS = [
  /^bertanggung jawab/i,
  /^bertugas/i,
  /^membantu dalam/i,
  /^terlibat dalam/i,
  /^responsible for/i,
  /^in charge of/i,
];

function normalize(text) {
  return (text || "").toLowerCase();
}

function textIncludesAny(normalizedText, terms) {
  return terms.some((term) => normalizedText.includes(term.toLowerCase()));
}

function extractContactSignals(cvText) {
  const emailMatch = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(cvText);
  const phoneMatch = /(\+?\d[\d\s-]{7,}\d)/.test(cvText);
  const linkedinMatch = /linkedin\.com|linkedin/i.test(cvText);
  return { hasEmail: emailMatch, hasPhone: phoneMatch, hasLinkedin: linkedinMatch };
}

function splitIntoSections(cvText) {
  const lines = cvText.split("\n").map((l) => l.trim());
  const sections = {};
  let currentKey = "header";
  sections[currentKey] = [];

  for (const line of lines) {
    if (line.length > 0 && line.length <= 45) {
      const matched = SECTION_HEADER_PATTERNS.find(({ pattern }) => pattern.test(line));
      if (matched) {
        currentKey = matched.key;
        sections[currentKey] = sections[currentKey] || [];
        continue;
      }
    }
    sections[currentKey] = sections[currentKey] || [];
    sections[currentKey].push(line);
  }
  return sections;
}

function extractBullets(sectionLines) {
  if (!sectionLines) return [];
  const bulletMarkerLines = sectionLines
    .filter((line) => /^[-•*●▪‣]\s*/.test(line))
    .map((line) => line.replace(/^[-•*●▪‣]\s*/, "").trim())
    .filter((line) => line.length > 0);

  if (bulletMarkerLines.length > 0) return bulletMarkerLines;

  // Fallback: baris yang cukup panjang & bukan baris tanggal/judul (tanpa marker eksplisit)
  return sectionLines
    .filter((line) => line.length >= 25 && !/^\(?(19|20)\d{2}\)?/.test(line))
    .slice(0, 10);
}

function classifyBullet(bullet) {
  const firstWord = bullet.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/gi, "") || "";
  const hasActionVerb = ID_ACTION_VERBS.includes(firstWord) || EN_ACTION_VERBS.includes(firstWord);
  const hasMetric = /\d/.test(bullet);
  const hasWeakOpening = WEAK_OPENING_PATTERNS.some((pattern) => pattern.test(bullet.trim()));
  const isWeak = (!hasActionVerb || hasWeakOpening) && !hasMetric;
  return { bullet, hasActionVerb, hasMetric, hasWeakOpening, isWeak };
}

function keywordCoverage(cvTextNormalized, keywords) {
  const found = [];
  const missing = [];
  for (const keyword of keywords) {
    if (textIncludesAny(cvTextNormalized, keyword.terms)) {
      found.push(keyword.label);
    } else {
      missing.push(keyword.label);
    }
  }
  return { found, missing };
}

function buildExecutiveSummary({ sections, contactSignals, coverage, allBullets, cvText }) {
  const wordCount = cvText.trim().split(/\s+/).filter(Boolean).length;
  const quantifiedCount = allBullets.filter((b) => b.hasMetric).length;
  const totalBullets = allBullets.length;
  const quantifiedRatio = totalBullets > 0 ? quantifiedCount / totalBullets : 0;
  const hasRingkasan = (sections.ringkasan || []).join(" ").trim().length > 0;
  const hasSkillSection = (sections.skill || []).join(" ").trim().length > 0;

  const points = [];

  points.push(
    `CV ini terdiri dari sekitar ${wordCount} kata dengan ${totalBullets} poin pengalaman/organisasi yang terdeteksi.`
  );

  if (!contactSignals.hasEmail || !contactSignals.hasPhone) {
    points.push("Informasi kontak (email/nomor telepon) belum lengkap terdeteksi — pastikan keduanya tercantum jelas di bagian atas CV.");
  } else {
    points.push("Informasi kontak dasar (email, telepon) sudah lengkap.");
  }

  if (!hasRingkasan) {
    points.push("CV belum punya bagian Ringkasan Profil/Summary di awal — bagian ini penting untuk memberi konteks cepat ke recruiter.");
  }

  if (totalBullets > 0) {
    if (quantifiedRatio < 0.3) {
      points.push(`Hanya ${quantifiedCount} dari ${totalBullets} poin pengalaman yang mengandung angka/hasil terukur — ini area terbesar yang perlu diperbaiki.`);
    } else {
      points.push(`${quantifiedCount} dari ${totalBullets} poin pengalaman sudah mengandung angka/hasil terukur — kekuatan yang perlu dipertahankan.`);
    }
  }

  if (coverage.found.length > 0) {
    points.push(`Beberapa keyword relevan untuk role target sudah muncul di CV: ${coverage.found.slice(0, 3).join(", ")}.`);
  }
  if (coverage.missing.length > 0) {
    points.push(`Keyword yang belum terlihat dan sebaiknya ditambahkan: ${coverage.missing.slice(0, 3).join(", ")}.`);
  }

  if (!hasSkillSection) {
    points.push("Bagian Skills/Keahlian belum terdeteksi secara eksplisit — pertimbangkan menambahkannya sebagai daftar terpisah.");
  }

  return points.join(" ");
}

function buildTargetRoleAnalysisSection({ roleDiinginkan, roleSpecified, industriDituju, levelKarier, category, coverage }) {
  const lines = [];
  lines.push("## 2. Target Role Analysis");
  lines.push("");
  lines.push(`**Role yang Diinginkan:** ${roleDiinginkan}`);
  lines.push(`**Industri yang Dituju:** ${industriDituju}`);
  lines.push(`**Level Karier:** ${levelKarier}`);
  lines.push("");
  lines.push("### Implikasi ke CV");
  lines.push("");

  if (!roleSpecified) {
    lines.push(
      "> Revisi ini masih bersifat umum karena role yang dituju belum terlalu spesifik. Kompetensi generik di bawah (hasil terukur, kepemimpinan, kolaborasi, problem solving) tetap relevan untuk hampir semua role, tapi hasil akan lebih tajam kalau kamu isi role yang lebih spesifik."
    );
  } else if (category) {
    lines.push(
      `CV kamu dicocokkan ke kategori **${category.name}**. Untuk role ini, recruiter/ATS biasanya mencari bukti konkret pada kompetensi: ${category.keywords
        .map((k) => k.label)
        .join(", ")}. Pastikan pengalaman kerja/organisasi kamu ditulis dengan menonjolkan kompetensi-kompetensi ini beserta hasil yang terukur (angka, persentase, skala tim/proyek), bukan hanya daftar tugas.`
    );
  } else {
    lines.push(
      `Role "${roleDiinginkan}" belum ada di daftar kategori bawaan tools ini, jadi kompetensi di bawah memakai daftar generik (hasil terukur, kepemimpinan, kolaborasi, problem solving, komunikasi, manajemen waktu/proyek). Silakan sesuaikan manual dengan kompetensi spesifik industri ${industriDituju || "target kamu"}.`
    );
  }

  lines.push("");
  lines.push("### Keyword yang Sebaiknya Muncul di CV");
  lines.push("");
  const keywordLabels = category ? category.keywords.map((k) => k.label) : FALLBACK_KEYWORDS.map((k) => k.label);
  for (const label of keywordLabels) {
    const isFound = coverage.found.includes(label);
    lines.push(`- ${label}${isFound ? " ✅ (sudah terdeteksi di CV)" : ""}`);
  }

  return lines.join("\n");
}

function buildPerSectionAnalysis({ sections, contactSignals }) {
  const lines = ["## 3. Analisis Per Bagian CV", ""];

  lines.push("### Data Diri / Kontak");
  if (contactSignals.hasEmail && contactSignals.hasPhone) {
    lines.push("- Email dan nomor telepon terdeteksi. Baik.");
  } else {
    if (!contactSignals.hasEmail) lines.push("- Email tidak terdeteksi — pastikan dicantumkan dengan jelas.");
    if (!contactSignals.hasPhone) lines.push("- Nomor telepon tidak terdeteksi — pastikan dicantumkan dengan jelas.");
  }
  lines.push(contactSignals.hasLinkedin ? "- Link LinkedIn terdeteksi. Baik." : "- Link LinkedIn tidak terdeteksi — pertimbangkan menambahkannya, banyak recruiter mengeceknya.");
  lines.push("");

  lines.push("### Ringkasan Profil");
  const ringkasanText = (sections.ringkasan || []).join(" ").trim();
  if (ringkasanText.length > 0) {
    lines.push(`- Bagian ini sudah ada (±${ringkasanText.split(/\s+/).filter(Boolean).length} kata). Pastikan isinya menyebutkan role target dan 1-2 pencapaian kunci, bukan cuma deskripsi umum.`);
  } else {
    lines.push("- Belum terdeteksi. Tambahkan 2-3 kalimat di awal CV yang merangkum siapa kamu, kekuatan utama, dan role yang dituju.");
  }
  lines.push("");

  lines.push("### Pengalaman Kerja & Organisasi");
  const pengalamanBullets = extractBullets(sections.pengalaman);
  const organisasiBullets = extractBullets(sections.organisasi);
  lines.push(`- Terdeteksi ${pengalamanBullets.length} poin di bagian Pengalaman Kerja dan ${organisasiBullets.length} poin di bagian Organisasi.`);
  if (pengalamanBullets.length === 0) {
    lines.push("- Bagian Pengalaman Kerja tidak terdeteksi jelas — pastikan menggunakan bullet point (-, •) supaya mudah dibaca ATS maupun recruiter.");
  }
  lines.push("");

  lines.push("### Pendidikan");
  const pendidikanText = (sections.pendidikan || []).join(" ").trim();
  lines.push(pendidikanText.length > 0 ? "- Bagian Pendidikan terdeteksi." : "- Bagian Pendidikan tidak terdeteksi dengan jelas — pastikan ada header \"Pendidikan\"/\"Education\" yang eksplisit.");
  lines.push("");

  lines.push("### Skills / Keahlian");
  const skillText = (sections.skill || []).join(" ").trim();
  lines.push(skillText.length > 0 ? "- Bagian Skills terdeteksi." : "- Bagian Skills/Keahlian tidak terdeteksi sebagai bagian terpisah — pertimbangkan menambahkannya agar keyword relevan lebih mudah ditangkap ATS.");

  return lines.join("\n");
}

function buildBulletRevisions(classifiedBullets) {
  const lines = ["## 4. Revisi Bullet Point (Before → After)", ""];
  const weakBullets = classifiedBullets.filter((b) => b.isWeak).slice(0, 5);

  if (weakBullets.length === 0) {
    lines.push("Semua poin pengalaman yang terdeteksi sudah cukup kuat (memakai action verb dan/atau mengandung hasil terukur). Tetap cek manual apakah angka/dampaknya benar-benar akurat.");
    return lines.join("\n");
  }

  lines.push("Poin-poin berikut terdeteksi lemah (tidak diawali action verb yang kuat dan/atau belum mengandung angka/hasil terukur). Pola perbaikannya:");
  lines.push("");
  for (const item of weakBullets) {
    lines.push(`Before: ${item.bullet}`);
    const tips = [];
    if (!item.hasActionVerb || item.hasWeakOpening) tips.push("mulai dengan action verb yang kuat (mis. Memimpin, Mengelola, Meningkatkan, Merancang)");
    if (!item.hasMetric) tips.push("tambahkan angka/hasil terukur (persentase, jumlah tim/klien, nilai proyek, efisiensi waktu)");
    lines.push(`Saran pola After: [${tips.join(" + ")}] — ${item.bullet.replace(/^(bertanggung jawab( untuk| atas)?|bertugas|membantu dalam|terlibat dalam)\s*/i, "")}`);
    lines.push("");
  }

  return lines.join("\n").trim();
}

function buildRecommendations({ coverage, contactSignals, sections, classifiedBullets, roleSpecified }) {
  const lines = ["## 5. Rekomendasi Prioritas", ""];
  const recs = [];

  const weakCount = classifiedBullets.filter((b) => b.isWeak).length;
  if (weakCount > 0) {
    recs.push(`Perbaiki ${weakCount} poin pengalaman yang belum memakai action verb kuat dan/atau belum ada angka hasil (quick win, dampak besar).`);
  }
  if (!contactSignals.hasEmail || !contactSignals.hasPhone) {
    recs.push("Lengkapi informasi kontak (email & nomor telepon) di bagian atas CV (quick win).");
  }
  if (coverage.missing.length > 0) {
    recs.push(`Sisipkan keyword yang masih kurang secara natural ke pengalaman/skill: ${coverage.missing.slice(0, 5).join(", ")}.`);
  }
  if ((sections.ringkasan || []).join(" ").trim().length === 0) {
    recs.push("Tambahkan bagian Ringkasan Profil/Summary singkat di awal CV yang menyebutkan role target.");
  }
  if ((sections.skill || []).join(" ").trim().length === 0) {
    recs.push("Tambahkan bagian Skills/Keahlian sebagai daftar terpisah agar mudah dipindai ATS.");
  }
  if (!roleSpecified) {
    recs.push("Tentukan role target yang lebih spesifik lalu jalankan review ulang untuk rekomendasi yang lebih tajam.");
  }
  if (recs.length === 0) {
    recs.push("Struktur dan isi CV sudah cukup solid berdasarkan pengecekan otomatis ini — fokus ke penyesuaian kata-kata agar lebih match dengan deskripsi lowongan spesifik yang kamu lamar.");
  }

  recs.forEach((rec, i) => lines.push(`${i + 1}. ${rec}`));
  return lines.join("\n");
}

function buildClosingNote({ roleSpecified }) {
  const lines = ["## 6. Catatan Penutup", ""];
  lines.push(
    "Review ini dihasilkan sepenuhnya oleh **aturan otomatis di dalam tools** (pencocokan keyword, deteksi struktur CV, dan pola bullet point) — bukan oleh model AI generatif. Artinya saran bersifat pola/checklist umum berdasarkan riset kompetensi role, dan perlu kamu sesuaikan dengan data asli (angka, nama proyek, pencapaian spesifik) yang paling tahu detailnya adalah kamu sendiri."
  );
  if (!roleSpecified) {
    lines.push("");
    lines.push("Revisi ini masih bersifat umum karena role yang dituju belum terlalu spesifik.");
  }
  return lines.join("\n");
}

/**
 * Fungsi utama: analisis CV secara rule-based, tanpa panggilan AI/LLM apa pun.
 * @returns {string} markdown lengkap sesuai FORMAT OUTPUT di docs/review-rules.md
 */
export function analyzeCv({ namaLengkap, roleDiinginkan, roleSpecified, industriDituju, levelKarier, bahasaCv, cvText }) {
  const cvTextNormalized = normalize(cvText);
  const sections = splitIntoSections(cvText);
  const contactSignals = extractContactSignals(cvText);

  const category = roleSpecified ? matchRoleCategory(roleDiinginkan) : null;
  const keywordsToCheck = category ? category.keywords : FALLBACK_KEYWORDS;
  const coverage = keywordCoverage(cvTextNormalized, keywordsToCheck);

  const pengalamanBullets = extractBullets(sections.pengalaman);
  const organisasiBullets = extractBullets(sections.organisasi);
  const classifiedBullets = [...pengalamanBullets, ...organisasiBullets].map(classifyBullet);

  const executiveSummary = buildExecutiveSummary({
    sections,
    contactSignals,
    coverage,
    allBullets: classifiedBullets,
    cvText,
  });

  const parts = [
    `# Hasil Review CV — ${namaLengkap}`,
    "",
    "## 1. Ringkasan Eksekutif",
    "",
    executiveSummary,
    "",
    buildTargetRoleAnalysisSection({ roleDiinginkan, roleSpecified, industriDituju, levelKarier, category, coverage }),
    "",
    buildPerSectionAnalysis({ sections, contactSignals }),
    "",
    buildBulletRevisions(classifiedBullets),
    "",
    buildRecommendations({ coverage, contactSignals, sections, classifiedBullets, roleSpecified }),
    "",
    buildClosingNote({ roleSpecified }),
  ];

  if (bahasaCv && bahasaCv.toLowerCase().startsWith("eng")) {
    parts.push(
      "",
      "> Note: this report is currently generated in Indonesian by the rule-based engine even though English was selected — full bilingual rule-based generation isn't supported yet. Use the checklist above as reference and translate the specific wording yourself."
    );
  }

  return parts.join("\n");
}
