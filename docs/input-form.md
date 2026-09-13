# Spesifikasi Form Input — Review CV

Dokumen ini mendefinisikan data yang harus dikumpulkan dari user **sebelum** CV diproses oleh Claude, supaya hasil revisi tidak generik dan selalu disesuaikan dengan tujuan karier user.

## 1. Upload CV

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `cv_file` | File upload (PDF) | Ya | CV yang akan direview. Maks. ukuran & jumlah halaman mengikuti batas aplikasi. |

## 2. Input Tambahan dari User

Selain upload PDF CV, form **wajib** meminta user mengisi field berikut sebelum submit:

| # | Field | Tipe | Wajib | Contoh Isian |
|---|---|---|---|---|
| 1 | **Nama Lengkap** | Text | Ya | Dona Arifah |
| 2 | **Role yang Diinginkan** | Text / Select + "Lainnya" | Ya | Management Trainee, Digital Marketing Specialist, Social Media Specialist, Business Development, HR Staff, Finance Staff, dll. |
| 3 | **Industri yang Dituju** | Text / Select + "Lainnya" | Ya | FMCG, Property, Agency, Startup, Banking, Education, dll. |
| 4 | **Level Karier** | Select | Ya | Fresh Graduate, Entry Level, Junior, Mid Level, Career Switcher |
| 5 | **Bahasa CV yang Diinginkan** | Select | Ya | Indonesia / English |

### Validasi

- Form tidak bisa disubmit jika salah satu dari 5 field di atas kosong, kecuali user secara eksplisit memilih opsi "Skip / Role belum pasti" pada field **Role yang Diinginkan** — dalam kasus ini proses tetap lanjut, tapi backend menandai `role_specified: false` agar Claude menampilkan catatan bahwa revisi masih bersifat umum (lihat `docs/system-prompt.md`).
- Field **Role yang Diinginkan** dan **Industri yang Dituju** sebaiknya berupa combobox (select + custom text) supaya konsisten tapi tetap fleksibel untuk role/industri yang tidak ada di daftar contoh.

## 3. Alur Aplikasi

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

## 4. Payload ke Backend / Prompt

Field-field ini dikirim bersama teks CV yang sudah diekstrak sebagai konteks untuk Claude (lihat `docs/system-prompt.md`, bagian "Input yang Diterima"):

```json
{
  "nama_lengkap": "string",
  "role_diinginkan": "string",
  "role_specified": true,
  "industri_dituju": "string",
  "level_karier": "Fresh Graduate | Entry Level | Junior | Mid Level | Career Switcher",
  "bahasa_cv": "Indonesia | English",
  "cv_text": "hasil ekstraksi teks dari cv_file"
}
```
