# CardioSense

CardioSense adalah aplikasi web untuk skrining awal risiko kardiovaskular dan edukasi pencegahan dalam Bahasa Indonesia. Aplikasi ini membantu pengguna mengisi data kesehatan dasar, mengirimkannya ke API prediksi eksternal, menampilkan estimasi risiko, lalu memberi rekomendasi edukatif dan chatbot pendamping berbasis Groq.

> CardioSense bukan alat diagnosis medis. Hasil skrining dan jawaban AI hanya bersifat edukatif dan tidak menggantikan konsultasi dengan tenaga kesehatan profesional.

## Fitur Utama

- Landing page edukatif tentang risiko kardiovaskular, faktor risiko, pencegahan, alur penggunaan, FAQ, dan CTA.
- Form skrining dengan validasi lokal untuk usia, jenis kelamin, berat, tinggi, lingkar perut, total kolesterol, tekanan darah, status merokok, diabetes, aktivitas fisik, dan riwayat keluarga.
- Integrasi API prediksi eksternal melalui `NEXT_PUBLIC_SCREENING_API_URL`; aplikasi otomatis mengirim request ke endpoint `/predict`.
- Hasil skrining dengan level risiko rendah, sedang, atau tinggi, skor risiko, faktor risiko/protektif dari model, dan rekomendasi dasar.
- Rekomendasi personal berbasis Groq melalui route internal `/api/recommendation`.
- Chatbot CardioSense melalui route internal `/api/chat`, dengan guard agar tetap berada di topik kesehatan kardiovaskular dan bisa menerima konteks hasil skrining terakhir.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Radix UI
- Framer Motion
- Lucide React
- Groq SDK
- Axios

## Struktur Project

```text
src/app/page.tsx                         # Komposisi halaman utama
src/app/api/chat/route.ts                # API chatbot CardioSense berbasis Groq
src/app/api/recommendation/route.ts      # API rekomendasi personal berbasis Groq
src/features/home/                       # Section landing page dan data copy
src/features/screening/                  # Form, hook, kontrak API, hasil, rekomendasi
src/features/chatbot/                    # UI chatbot, hook, tipe, konteks skrining
src/components/ui/                       # Komponen UI dasar
src/components/shared/                   # Komponen bersama
tests/                                   # Contract test untuk screening, chatbot, rekomendasi
```

## Prasyarat

- Node.js dan npm.
- API prediksi screening yang menerima `POST /predict`.
- Groq API key untuk fitur chatbot dan rekomendasi AI.

## Environment

Salin `.env.example` ke `.env.local`, lalu isi nilainya:

```bash
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-20b
NEXT_PUBLIC_SCREENING_API_URL=https://your-screening-api.example.com
```

Catatan:

- `GROQ_API_KEY` hanya dipakai di server route Next.js. Jangan ubah menjadi `NEXT_PUBLIC_*`.
- Jika `GROQ_MODEL` tidak diisi, route internal memakai default `openai/gpt-oss-20b`.
- `NEXT_PUBLIC_SCREENING_API_URL` boleh berupa base URL atau URL yang sudah berakhir dengan `/predict`; aplikasi akan menormalkannya.
- Jangan commit `.env.local`. Jika key pernah bocor di chat, log, atau kode, revoke key tersebut dan buat key baru.

## Menjalankan Lokal

Install dependencies:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Command lain:

```bash
npm run lint
npm run build
npm run start
node --test tests/*.test.mjs
```

`node --test tests/*.test.mjs` menjalankan contract test yang ada di folder `tests/`. Node dapat menampilkan warning `MODULE_TYPELESS_PACKAGE_JSON`, tetapi test tetap valid selama semua assertion pass.

## Kontrak API Screening

Frontend mengirim payload dari form ke API eksternal:

```http
POST {NEXT_PUBLIC_SCREENING_API_URL}/predict
Content-Type: application/json
```

Contoh request:

```json
{
  "sex": 0,
  "age": 45,
  "weight": 72.5,
  "height": 170,
  "abdominal_circumference": 91,
  "total_cholesterol": 214,
  "smoking_status": 1,
  "diabetes_status": 1,
  "physical_activity_level": 1,
  "family_history_cvd": 1,
  "systolic_bp": 138,
  "diastolic_bp": 86
}
```

Kode nilai:

- `sex`: `0` laki-laki, `1` perempuan.
- `total_cholesterol`: angka mg/dL bila tersedia, atau `null` bila belum ada hasil lab.
- `smoking_status`, `diabetes_status`, `family_history_cvd`: `0` tidak, `1` ya.
- `physical_activity_level`: `1` jarang, `2` kadang-kadang, `3` rutin.

Contoh response yang diharapkan:

```json
{
  "raw_risk_score": 18.912,
  "normalized_risk_score": 63.4,
  "risk_level": "Moderate",
  "top_risk_factors": [
    {
      "feature": "Systolic Blood Pressure",
      "value": 138,
      "impact": 0.456
    }
  ],
  "protective_factors": [
    {
      "feature": "Physical Activity",
      "value": 2,
      "impact": -0.12
    }
  ]
}
```

`risk_level` harus salah satu dari `Low`, `Moderate`, atau `High`. `normalized_risk_score` harus berada pada rentang `0` sampai `100`.

## Alur AI

- `/api/recommendation` menerima `values` dan `result`, lalu meminta Groq membuat 3-5 poin rekomendasi edukatif dalam JSON valid.
- `/api/chat` menerima history chat dan optional `screeningContext`, membersihkan input, membatasi history, menolak topik di luar CardioSense, lalu meneruskan prompt ke Groq.
- Kedua route mengembalikan error aman untuk kondisi key belum dikonfigurasi, rate limit, timeout, atau kegagalan provider.

## Pengembangan

- Entry UI utama ada di `src/app/page.tsx`.
- Copy dan konfigurasi field landing page berada di `src/features/home/data/HomeData.ts`.
- Mapping payload dan normalisasi response API screening berada di `src/features/screening/utils/ApiContract.ts`.
- Validasi form dan transformasi hasil berada di `src/features/screening/utils/Risk.ts`.
- Konteks hasil skrining untuk chatbot berada di `src/features/chatbot/utils/ScreeningContext.ts`.

Saat mengubah kontrak API, jalankan:

```bash
node --test tests/screening-api-contract.test.mjs
```

Saat mengubah rekomendasi atau konteks chatbot, jalankan:

```bash
node --test tests/screening-recommendation-contract.test.mjs tests/screening-recommendation-api.test.mjs tests/chatbot-screening-context.test.mjs
```
