# Aturan Review CV (Rule-Based, Tanpa AI)

Dokumen ini adalah spesifikasi logika yang dipakai tools untuk mereview CV. **Tidak ada panggilan API/model AI apa pun** — semua analisis dijalankan sebagai kode deterministik di `lib/roleCategories.js` dan `lib/cvAnalyzer.js`. Kalau tabel kompetensi di bawah diubah, `lib/roleCategories.js` perlu diupdate juga (dan sebaliknya) supaya keduanya tetap sinkron.

---

## CARA KERJA

1. Teks CV diekstrak dari PDF yang diupload (`lib/extractPdfText.js`).
2. Input **Role yang Diinginkan** dicocokkan ke salah satu kategori di tabel bawah lewat substring/fuzzy match pada nama & alias kategori (`matchRoleCategory` di `lib/roleCategories.js`). Kalau role kosong/di-skip atau tidak cocok kategori manapun, dipakai daftar kompetensi generik (`FALLBACK_KEYWORDS`).
3. Untuk kategori yang cocok, setiap keyword-nya dicek kemunculannya secara harfiah (case-insensitive) di teks CV — hasilnya jadi daftar "sudah ada" vs "belum muncul".
4. CV dipecah per bagian (Kontak, Ringkasan, Pengalaman Kerja, Pendidikan, Skills, Organisasi) berdasarkan deteksi header umum, lalu poin-poin (bullet) di bagian Pengalaman Kerja & Organisasi diambil dan diklasifikasi: apakah diawali action verb yang kuat, dan apakah mengandung angka/hasil terukur.
5. Semua temuan di atas dirangkai jadi laporan markdown sesuai **FORMAT OUTPUT** di bawah.

Karena ini rule-based (bukan model bahasa), saran yang dihasilkan bersifat **pola/checklist**, bukan penulisan ulang yang memahami konteks penuh — user tetap perlu mengisi detail (angka, nama proyek) sendiri.

## INPUT YANG DIPAKAI

Setiap review memakai:

1. Teks hasil ekstraksi dari CV (PDF) yang diupload user.
2. Data tambahan dari form:
   - **Nama Lengkap**
   - **Role yang Diinginkan**
   - **Industri yang Dituju**
   - **Level Karier**
   - **Bahasa CV yang Diinginkan** (Indonesia / English — saat ini laporan tetap dibuat dalam Bahasa Indonesia karena mesin rule-based belum mendukung generasi dwibahasa penuh; lihat catatan di `lib/cvAnalyzer.js`)

---

## PENYESUAIAN BERDASARKAN ROLE YANG DIINGINKAN

Semua rekomendasi dan pengecekan keyword disesuaikan dengan role target user. Input **Role yang Diinginkan** dicocokkan ke kategori yang paling mendekati pada tabel berikut (pencocokan fuzzy/sinonim — misal "Programmer", "Software Developer", "Backend Engineer" semua masuk kategori **IT/Software Engineering**), lalu kompetensi & keyword pada baris tersebut dipakai di seluruh bagian laporan.

| Kategori Role | Kompetensi & Keyword yang Ditonjolkan |
|---|---|
| **Management Trainee** | Leadership, Problem solving, Analytical thinking, Project management, Business impact, Initiative, Communication, Cross-functional experience |
| **Digital Marketing** | Campaign performance, Leads, CTR/CPC/CPL/ROAS, Content strategy, SEO/SEM, Social media growth, Marketing funnel, Analytics tools |
| **Social Media** | Content planning, Engagement rate, Follower growth, Creative campaign, Community management, Copywriting, Trend analysis |
| **Business Development / Sales** | Revenue, Client acquisition, Partnership, Negotiation, Pipeline, Conversion rate, Market research |
| **HR / People** | Recruitment, Employee engagement, Training, Administration accuracy, People coordination, Time-to-hire, Candidate management |
| **IT / Software Engineering** (Developer, Programmer, Backend/Frontend/Full-Stack, Mobile Engineer) | Programming languages & tech stack yang relevan, System design, Code quality/code review, Debugging & troubleshooting, CI/CD & deployment, Testing/automation, Performance/uptime improvement, Kolaborasi lintas tim (product/QA) |
| **Data Analyst / Data Scientist** | SQL & data cleaning, Dashboard/reporting (Tableau, Power BI, dsb.), Statistical analysis, Predictive modeling, Data visualization, Business insight untuk decision making, A/B testing, Otomasi laporan |
| **IT Support / System Administrator / Network Engineer** | Troubleshooting hardware/software, Incident/ticket resolution time, System uptime, Network/server maintenance, Keamanan sistem dasar, Dokumentasi SOP, User support satisfaction |
| **UI/UX Design / Product Design** | User research, Wireframing & prototyping, Usability testing, Design system, Tools (Figma/Adobe XD), Conversion/usability improvement, Kolaborasi dengan product & engineering |
| **Product Management** | Product roadmap, Stakeholder management, User research, Feature prioritization, Metrics (retention, adoption, engagement), A/B testing, Kepemimpinan lintas fungsi |
| **Project Management** | Timeline & milestone delivery, Budget management, Risk management, Stakeholder communication, Resource allocation, Agile/Scrum, Koordinasi lintas tim |
| **Quality Assurance / QA Engineer** | Test case design, Bug/defect detection rate, Automation testing, Regression testing, Defect tracking, Kepatuhan standar kualitas |
| **Finance / Accounting** | Financial reporting, Budgeting & forecasting, Rekonsiliasi, Efisiensi biaya, Kepatuhan audit, Akurasi data, Tools ERP/accounting |
| **Operations / Supply Chain / Logistics** | Efisiensi proses, Manajemen inventori, Koordinasi vendor/supplier, Efisiensi biaya, Kepatuhan SOP, Lead time, Distribusi |
| **Customer Service / Customer Support** | Response time/SLA, Customer satisfaction (CSAT/NPS), Penyelesaian masalah, Penanganan komplain, Retensi pelanggan, Tools CRM/ticketing |
| **Admin / Office Support / Secretary** | Akurasi administratif, Penjadwalan, Dokumentasi & korespondensi, Manajemen sistem kearsipan, Multitasking, Kerahasiaan data |
| **Content Writer / Copywriter** | Content strategy, SEO writing, Brand voice, Metrik engagement, Editorial calendar, Storytelling, Copy yang mendorong konversi |
| **Legal / Compliance** | Review kontrak, Kepatuhan regulasi, Mitigasi risiko, Riset hukum, Negosiasi, Penyusunan kebijakan |
| **Procurement / Purchasing** | Negosiasi vendor, Penghematan biaya, Manajemen supplier, Akurasi purchase order, Manajemen kontrak |
| **Education / Teaching / Training** | Desain kurikulum, Hasil belajar peserta, Manajemen kelas/pelatihan, Instructional design, Engagement & asesmen |
| **Healthcare / Medical / Nursing** | Kualitas perawatan pasien, Prosedur klinis, Kepatuhan standar kesehatan, Kepuasan pasien, Manajemen kasus |
| **Retail / Merchandising / Store Operations** | Pencapaian target penjualan, Visual merchandising, Akurasi inventori, Pengalaman pelanggan di toko, KPI toko (footfall/conversion) |
| **Engineering Non-IT** (Civil/Mechanical/Electrical) | Desain & drafting teknis, Kepatuhan spesifikasi proyek, Standar keselamatan (K3), Efisiensi biaya/waktu, Tools (AutoCAD, dsb.), Quality control |
| **Consulting / Strategy** | Problem-solving framework, Client engagement, Rekomendasi berbasis data, Presentasi ke stakeholder, Dampak proyek yang terukur |

Kalau role tidak cukup jelas (termasuk saat `role_specified: false`) atau tidak cocok kategori manapun, tools memakai daftar kompetensi generik (`FALLBACK_KEYWORDS`: hasil terukur, kepemimpinan/inisiatif, kolaborasi tim, problem solving, komunikasi, manajemen waktu/proyek) dan menambahkan catatan:

> Revisi ini masih bersifat umum karena role yang dituju belum terlalu spesifik.

---

## FORMAT OUTPUT

Laporan yang dihasilkan `analyzeCv()` mengikuti urutan ini:

### 1. Ringkasan Eksekutif

Ringkasan otomatis: jumlah kata CV, jumlah poin pengalaman terdeteksi, kelengkapan kontak, rasio poin yang sudah punya hasil terukur, keyword yang sudah/belum muncul.

### 2. Target Role Analysis

```markdown
## 2. Target Role Analysis

**Role yang Diinginkan:** [isi dari user]
**Industri yang Dituju:** [isi dari user]
**Level Karier:** [isi dari user]

### Implikasi ke CV
[Penjelasan kompetensi yang harus ditonjolkan, berdasarkan kategori role yang cocok.]

### Keyword yang Sebaiknya Muncul di CV
- [keyword 1] (ditandai ✅ kalau sudah terdeteksi di CV)
- [keyword 2]
- ...
```

### 3. Analisis Per Bagian CV

Per bagian (Data Diri/Kontak, Ringkasan Profil, Pengalaman Kerja & Organisasi, Pendidikan, Skills), tampilkan apa yang terdeteksi ada/tidak ada berdasarkan pemindaian struktur CV.

### 4. Revisi Bullet Point (Before → After)

Untuk bullet point yang terdeteksi lemah (tidak diawali action verb kuat dan/atau tidak ada angka), tampilkan:

```
Before: [bullet asli]
Saran pola After: [action verb + hasil terukur] — [bullet asli tanpa frasa pembuka pasif]
```

### 5. Rekomendasi Prioritas

Daftar tindakan berurutan berdasarkan gap yang ditemukan (bullet lemah, kontak tidak lengkap, keyword hilang, bagian yang tidak terdeteksi), quick win di atas.

### 6. Catatan Penutup

Penjelasan bahwa laporan dihasilkan rule-based (bukan AI generatif) + catatan "role belum spesifik" bila berlaku.

---

## FLOW APLIKASI (konteks)

```
Upload CV PDF
      ↓
Isi target role
      ↓
Tools mengekstrak teks CV & menjalankan aturan di atas
      ↓
Hasil review langsung tampil, disesuaikan dengan role tujuan
      ↓
User download PDF hasil review
```

Aturan ini memastikan setiap hasil bukan sekadar "review CV umum", melainkan **review CV berdasarkan tujuan karier user** — sepenuhnya dijalankan di dalam tools, tanpa bergantung pada API AI eksternal apa pun.
