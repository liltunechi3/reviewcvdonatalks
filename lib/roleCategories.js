/**
 * Data kategori role — sumber kebenaran untuk mesin review rule-based
 * (tidak ada panggilan AI/LLM apa pun). Setiap kategori punya:
 * - aliases: kata kunci untuk mencocokkan input bebas "Role yang Diinginkan"
 *   ke kategori yang paling sesuai (fuzzy/substring match).
 * - keywords: kompetensi yang harus ditonjolkan untuk kategori ini,
 *   masing-masing dengan varian istilah (Indonesia/Inggris) yang dicek
 *   kemunculannya secara harfiah di teks CV.
 *
 * Tabel ini adalah versi kode dari tabel "Penyesuaian Berdasarkan Role
 * yang Diinginkan" di docs/review-rules.md — kalau salah satu diubah,
 * yang lain sebaiknya ikut disesuaikan.
 */

function kw(label, terms) {
  return { label, terms };
}

export const ROLE_CATEGORIES = [
  {
    id: "management-trainee",
    name: "Management Trainee",
    aliases: ["management trainee", "trainee program", "graduate trainee", "mt program"],
    keywords: [
      kw("Leadership", ["leadership", "kepemimpinan", "memimpin"]),
      kw("Problem solving", ["problem solving", "pemecahan masalah"]),
      kw("Analytical thinking", ["analytical thinking", "analisis", "berpikir analitis"]),
      kw("Project management", ["project management", "manajemen proyek"]),
      kw("Business impact", ["business impact", "dampak bisnis"]),
      kw("Initiative", ["initiative", "inisiatif"]),
      kw("Communication", ["communication", "komunikasi"]),
      kw("Cross-functional experience", ["cross-functional", "lintas fungsi", "lintas divisi"]),
    ],
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    aliases: ["digital marketing", "performance marketing", "growth marketing", "media buyer", "paid ads", "seo specialist", "sem specialist"],
    keywords: [
      kw("Campaign performance", ["campaign performance", "performa kampanye"]),
      kw("Leads", ["leads", "leads generation", "prospek"]),
      kw("CTR/CPC/CPL/ROAS", ["ctr", "cpc", "cpl", "roas"]),
      kw("Content strategy", ["content strategy", "strategi konten"]),
      kw("SEO/SEM", ["seo", "sem"]),
      kw("Social media growth", ["social media growth", "pertumbuhan media sosial"]),
      kw("Marketing funnel", ["marketing funnel", "funnel"]),
      kw("Analytics tools", ["google analytics", "analytics", "meta ads", "google ads"]),
    ],
  },
  {
    id: "social-media",
    name: "Social Media",
    aliases: ["social media", "social media specialist", "social media officer", "content creator", "community manager"],
    keywords: [
      kw("Content planning", ["content planning", "perencanaan konten"]),
      kw("Engagement rate", ["engagement rate", "engagement"]),
      kw("Follower growth", ["follower growth", "pertumbuhan follower"]),
      kw("Creative campaign", ["creative campaign", "kampanye kreatif"]),
      kw("Community management", ["community management", "manajemen komunitas"]),
      kw("Copywriting", ["copywriting", "copywriter"]),
      kw("Trend analysis", ["trend analysis", "analisis tren"]),
    ],
  },
  {
    id: "business-development-sales",
    name: "Business Development / Sales",
    aliases: ["business development", "bd", "sales", "account executive", "sales executive", "key account", "partnership manager"],
    keywords: [
      kw("Revenue", ["revenue", "pendapatan", "omzet"]),
      kw("Client acquisition", ["client acquisition", "akuisisi klien"]),
      kw("Partnership", ["partnership", "kemitraan"]),
      kw("Negotiation", ["negotiation", "negosiasi"]),
      kw("Pipeline", ["pipeline", "sales pipeline"]),
      kw("Conversion rate", ["conversion rate", "tingkat konversi"]),
      kw("Market research", ["market research", "riset pasar"]),
    ],
  },
  {
    id: "hr-people",
    name: "HR / People",
    aliases: ["hr", "human resources", "hr staff", "hr generalist", "recruiter", "talent acquisition", "people"],
    keywords: [
      kw("Recruitment", ["recruitment", "rekrutmen"]),
      kw("Employee engagement", ["employee engagement", "keterlibatan karyawan"]),
      kw("Training", ["training", "pelatihan"]),
      kw("Administration accuracy", ["administrasi", "administration"]),
      kw("People coordination", ["people coordination", "koordinasi tim"]),
      kw("Time-to-hire", ["time-to-hire", "time to hire"]),
      kw("Candidate management", ["candidate management", "manajemen kandidat"]),
    ],
  },
  {
    id: "it-software-engineering",
    name: "IT / Software Engineering",
    aliases: [
      "it",
      "software engineer",
      "software developer",
      "programmer",
      "backend engineer",
      "backend developer",
      "frontend engineer",
      "frontend developer",
      "full stack",
      "fullstack",
      "mobile engineer",
      "mobile developer",
      "web developer",
      "developer",
    ],
    keywords: [
      kw("Programming language & tech stack", ["javascript", "python", "java", "php", "golang", "kotlin", "swift", "react", "node"]),
      kw("System design", ["system design", "arsitektur sistem"]),
      kw("Code quality / code review", ["code review", "code quality", "kualitas kode"]),
      kw("Debugging & troubleshooting", ["debugging", "troubleshooting"]),
      kw("CI/CD & deployment", ["ci/cd", "deployment", "devops"]),
      kw("Testing/automation", ["unit test", "automation testing", "testing"]),
      kw("Performance/uptime", ["performance", "uptime", "optimasi performa"]),
      kw("Kolaborasi lintas tim", ["cross-functional", "lintas tim", "agile", "scrum"]),
    ],
  },
  {
    id: "data-analyst-scientist",
    name: "Data Analyst / Data Scientist",
    aliases: ["data analyst", "data scientist", "data science", "business intelligence", "bi analyst"],
    keywords: [
      kw("SQL & data cleaning", ["sql", "data cleaning", "pembersihan data"]),
      kw("Dashboard/reporting", ["dashboard", "tableau", "power bi", "looker"]),
      kw("Statistical analysis", ["statistical analysis", "analisis statistik"]),
      kw("Predictive modeling", ["predictive modeling", "machine learning", "model prediktif"]),
      kw("Data visualization", ["data visualization", "visualisasi data"]),
      kw("Business insight", ["business insight", "decision making", "pengambilan keputusan"]),
      kw("A/B testing", ["a/b testing", "ab testing"]),
      kw("Otomasi laporan", ["otomasi laporan", "report automation"]),
    ],
  },
  {
    id: "it-support-sysadmin",
    name: "IT Support / System Administrator / Network Engineer",
    aliases: ["it support", "system administrator", "sysadmin", "network engineer", "technical support", "helpdesk"],
    keywords: [
      kw("Troubleshooting hardware/software", ["troubleshooting"]),
      kw("Incident/ticket resolution", ["ticket resolution", "incident resolution", "penyelesaian tiket"]),
      kw("System uptime", ["system uptime", "uptime"]),
      kw("Network/server maintenance", ["network maintenance", "server maintenance", "pemeliharaan server"]),
      kw("Keamanan sistem dasar", ["keamanan sistem", "system security"]),
      kw("Dokumentasi SOP", ["sop", "dokumentasi"]),
      kw("User support satisfaction", ["user satisfaction", "kepuasan pengguna"]),
    ],
  },
  {
    id: "ui-ux-product-design",
    name: "UI/UX Design / Product Design",
    aliases: ["ui/ux", "ux designer", "ui designer", "product designer", "graphic designer"],
    keywords: [
      kw("User research", ["user research", "riset pengguna"]),
      kw("Wireframing & prototyping", ["wireframe", "prototyping", "prototipe"]),
      kw("Usability testing", ["usability testing", "uji usabilitas"]),
      kw("Design system", ["design system"]),
      kw("Tools (Figma/Adobe XD)", ["figma", "adobe xd", "sketch"]),
      kw("Conversion/usability improvement", ["conversion rate", "usability improvement"]),
      kw("Kolaborasi dengan product & engineering", ["cross-functional", "kolaborasi tim"]),
    ],
  },
  {
    id: "product-management",
    name: "Product Management",
    aliases: ["product manager", "product management", "po", "product owner"],
    keywords: [
      kw("Product roadmap", ["product roadmap", "roadmap produk"]),
      kw("Stakeholder management", ["stakeholder management", "manajemen stakeholder"]),
      kw("User research", ["user research", "riset pengguna"]),
      kw("Feature prioritization", ["feature prioritization", "prioritas fitur"]),
      kw("Metrics (retention/adoption)", ["retention", "adoption", "engagement metrics"]),
      kw("A/B testing", ["a/b testing", "ab testing"]),
      kw("Kepemimpinan lintas fungsi", ["cross-functional leadership", "lintas fungsi"]),
    ],
  },
  {
    id: "project-management",
    name: "Project Management",
    aliases: ["project manager", "project management", "scrum master", "pmo"],
    keywords: [
      kw("Timeline & milestone delivery", ["timeline", "milestone"]),
      kw("Budget management", ["budget management", "manajemen anggaran"]),
      kw("Risk management", ["risk management", "manajemen risiko"]),
      kw("Stakeholder communication", ["stakeholder communication", "komunikasi stakeholder"]),
      kw("Resource allocation", ["resource allocation", "alokasi sumber daya"]),
      kw("Agile/Scrum", ["agile", "scrum", "kanban"]),
      kw("Koordinasi lintas tim", ["koordinasi lintas tim", "cross-functional"]),
    ],
  },
  {
    id: "qa-engineer",
    name: "Quality Assurance / QA Engineer",
    aliases: ["qa", "quality assurance", "tester", "test engineer", "sdet"],
    keywords: [
      kw("Test case design", ["test case", "skenario pengujian"]),
      kw("Bug/defect detection rate", ["bug detection", "defect detection"]),
      kw("Automation testing", ["automation testing", "selenium", "cypress"]),
      kw("Regression testing", ["regression testing", "uji regresi"]),
      kw("Defect tracking", ["defect tracking", "jira", "bug tracking"]),
      kw("Kepatuhan standar kualitas", ["quality standard", "standar kualitas"]),
    ],
  },
  {
    id: "finance-accounting",
    name: "Finance / Accounting",
    aliases: ["finance", "accounting", "akuntansi", "keuangan", "accountant", "financial analyst", "staff finance"],
    keywords: [
      kw("Financial reporting", ["financial reporting", "laporan keuangan"]),
      kw("Budgeting & forecasting", ["budgeting", "forecasting", "penganggaran"]),
      kw("Rekonsiliasi", ["rekonsiliasi", "reconciliation"]),
      kw("Efisiensi biaya", ["efisiensi biaya", "cost efficiency", "cost saving"]),
      kw("Kepatuhan audit", ["audit", "kepatuhan"]),
      kw("Akurasi data", ["akurasi data", "data accuracy"]),
      kw("Tools ERP/accounting", ["sap", "erp", "accurate", "xero", "quickbooks"]),
    ],
  },
  {
    id: "operations-supply-chain",
    name: "Operations / Supply Chain / Logistics",
    aliases: ["operations", "supply chain", "logistics", "warehouse", "procurement operations"],
    keywords: [
      kw("Efisiensi proses", ["efisiensi proses", "process efficiency"]),
      kw("Manajemen inventori", ["inventory management", "manajemen inventori", "stok"]),
      kw("Koordinasi vendor/supplier", ["vendor coordination", "supplier coordination"]),
      kw("Efisiensi biaya", ["cost efficiency", "efisiensi biaya"]),
      kw("Kepatuhan SOP", ["sop"]),
      kw("Lead time", ["lead time"]),
      kw("Distribusi", ["distribusi", "distribution"]),
    ],
  },
  {
    id: "customer-service",
    name: "Customer Service / Customer Support",
    aliases: ["customer service", "customer support", "cs", "customer care"],
    keywords: [
      kw("Response time/SLA", ["response time", "sla"]),
      kw("Customer satisfaction (CSAT/NPS)", ["csat", "nps", "customer satisfaction"]),
      kw("Penyelesaian masalah", ["problem resolution", "penyelesaian masalah"]),
      kw("Penanganan komplain", ["handling complaint", "penanganan komplain"]),
      kw("Retensi pelanggan", ["customer retention", "retensi pelanggan"]),
      kw("Tools CRM/ticketing", ["crm", "zendesk", "freshdesk"]),
    ],
  },
  {
    id: "admin-office-support",
    name: "Admin / Office Support / Secretary",
    aliases: ["admin", "administrasi", "office support", "secretary", "sekretaris", "personal assistant"],
    keywords: [
      kw("Akurasi administratif", ["akurasi administratif", "administrative accuracy"]),
      kw("Penjadwalan", ["penjadwalan", "scheduling"]),
      kw("Dokumentasi & korespondensi", ["korespondensi", "correspondence", "dokumentasi"]),
      kw("Manajemen kearsipan", ["filing system", "kearsipan"]),
      kw("Multitasking", ["multitasking"]),
      kw("Kerahasiaan data", ["confidentiality", "kerahasiaan"]),
    ],
  },
  {
    id: "content-writer-copywriter",
    name: "Content Writer / Copywriter",
    aliases: ["content writer", "copywriter", "content creator", "penulis konten"],
    keywords: [
      kw("Content strategy", ["content strategy", "strategi konten"]),
      kw("SEO writing", ["seo writing", "seo"]),
      kw("Brand voice", ["brand voice"]),
      kw("Metrik engagement", ["engagement metrics", "engagement"]),
      kw("Editorial calendar", ["editorial calendar", "kalender editorial"]),
      kw("Storytelling", ["storytelling"]),
      kw("Copy konversi", ["conversion copy", "copy konversi"]),
    ],
  },
  {
    id: "legal-compliance",
    name: "Legal / Compliance",
    aliases: ["legal", "compliance", "hukum", "paralegal", "legal officer"],
    keywords: [
      kw("Review kontrak", ["contract review", "review kontrak"]),
      kw("Kepatuhan regulasi", ["regulatory compliance", "kepatuhan regulasi"]),
      kw("Mitigasi risiko", ["risk mitigation", "mitigasi risiko"]),
      kw("Riset hukum", ["legal research", "riset hukum"]),
      kw("Negosiasi", ["negotiation", "negosiasi"]),
      kw("Penyusunan kebijakan", ["policy drafting", "penyusunan kebijakan"]),
    ],
  },
  {
    id: "procurement-purchasing",
    name: "Procurement / Purchasing",
    aliases: ["procurement", "purchasing", "pembelian", "buyer"],
    keywords: [
      kw("Negosiasi vendor", ["vendor negotiation", "negosiasi vendor"]),
      kw("Penghematan biaya", ["cost saving", "penghematan biaya"]),
      kw("Manajemen supplier", ["supplier management", "manajemen supplier"]),
      kw("Akurasi purchase order", ["purchase order", "po accuracy"]),
      kw("Manajemen kontrak", ["contract management", "manajemen kontrak"]),
    ],
  },
  {
    id: "education-teaching-training",
    name: "Education / Teaching / Training",
    aliases: ["guru", "teacher", "trainer", "tutor", "dosen", "instructor", "pendidik", "teaching"],
    keywords: [
      kw("Desain kurikulum", ["curriculum design", "desain kurikulum"]),
      kw("Hasil belajar peserta", ["learning outcome", "hasil belajar"]),
      kw("Manajemen kelas/pelatihan", ["classroom management", "manajemen kelas"]),
      kw("Instructional design", ["instructional design"]),
      kw("Engagement & asesmen", ["assessment", "asesmen", "evaluasi belajar"]),
    ],
  },
  {
    id: "healthcare-medical-nursing",
    name: "Healthcare / Medical / Nursing",
    aliases: ["perawat", "nurse", "medis", "healthcare", "dokter", "tenaga medis", "bidan"],
    keywords: [
      kw("Kualitas perawatan pasien", ["patient care", "perawatan pasien"]),
      kw("Prosedur klinis", ["clinical procedure", "prosedur klinis"]),
      kw("Kepatuhan standar kesehatan", ["health standard compliance", "standar kesehatan"]),
      kw("Kepuasan pasien", ["patient satisfaction", "kepuasan pasien"]),
      kw("Manajemen kasus", ["case management", "manajemen kasus"]),
    ],
  },
  {
    id: "retail-merchandising",
    name: "Retail / Merchandising / Store Operations",
    aliases: ["retail", "store", "merchandising", "toko", "sales associate"],
    keywords: [
      kw("Pencapaian target penjualan", ["sales target", "target penjualan"]),
      kw("Visual merchandising", ["visual merchandising"]),
      kw("Akurasi inventori", ["inventory accuracy", "akurasi inventori"]),
      kw("Pengalaman pelanggan di toko", ["customer experience", "pengalaman pelanggan"]),
      kw("KPI toko (footfall/conversion)", ["footfall", "conversion rate"]),
    ],
  },
  {
    id: "engineering-non-it",
    name: "Engineering Non-IT (Civil/Mechanical/Electrical)",
    aliases: ["civil engineer", "mechanical engineer", "electrical engineer", "teknik sipil", "teknik mesin", "teknik elektro"],
    keywords: [
      kw("Desain & drafting teknis", ["technical drafting", "desain teknis", "autocad"]),
      kw("Kepatuhan spesifikasi proyek", ["project specification", "spesifikasi proyek"]),
      kw("Standar keselamatan (K3)", ["k3", "safety standard", "keselamatan kerja"]),
      kw("Efisiensi biaya/waktu", ["cost efficiency", "efisiensi waktu"]),
      kw("Tools (AutoCAD, dsb.)", ["autocad", "solidworks", "sketchup"]),
      kw("Quality control", ["quality control"]),
    ],
  },
  {
    id: "consulting-strategy",
    name: "Consulting / Strategy",
    aliases: ["consultant", "consulting", "strategy", "konsultan"],
    keywords: [
      kw("Problem-solving framework", ["problem-solving framework", "kerangka penyelesaian masalah"]),
      kw("Client engagement", ["client engagement", "keterlibatan klien"]),
      kw("Rekomendasi berbasis data", ["data-driven recommendation", "rekomendasi berbasis data"]),
      kw("Presentasi ke stakeholder", ["stakeholder presentation", "presentasi stakeholder"]),
      kw("Dampak proyek terukur", ["measurable impact", "dampak terukur"]),
    ],
  },
];

/** Kompetensi generik dipakai saat role tidak spesifik / tidak ditemukan kecocokan kategori. */
export const FALLBACK_KEYWORDS = [
  kw("Hasil yang terukur (angka/persentase)", ["%", "meningkat", "menurun"]),
  kw("Kepemimpinan / inisiatif", ["leadership", "kepemimpinan", "inisiatif"]),
  kw("Kolaborasi tim", ["kolaborasi", "collaboration", "cross-functional"]),
  kw("Problem solving", ["problem solving", "pemecahan masalah"]),
  kw("Komunikasi", ["komunikasi", "communication"]),
  kw("Manajemen waktu/proyek", ["manajemen waktu", "manajemen proyek", "project management"]),
];

/**
 * Cocokkan input "Role yang Diinginkan" bebas dari user ke salah satu
 * kategori lewat substring match terhadap nama & aliases (case-insensitive,
 * dua arah supaya "Backend Engineer" cocok ke alias "backend engineer" dan
 * juga rolePun yang lebih pendek dari alias tetap match).
 */
export function matchRoleCategory(roleInput) {
  const normalized = (roleInput || "").toLowerCase().trim();
  if (!normalized) return null;

  for (const category of ROLE_CATEGORIES) {
    const candidates = [category.name.toLowerCase(), ...category.aliases];
    const isMatch = candidates.some((candidate) => normalized.includes(candidate) || candidate.includes(normalized));
    if (isMatch) return category;
  }
  return null;
}
