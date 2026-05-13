import {
  Activity,
  Apple,
  BookOpen,
  Brain,
  CigaretteOff,
  ClipboardCheck,
  ClipboardList,
  Dumbbell,
  HeartCrack,
  HeartHandshake,
  HeartPulse,
  Moon,
  SearchCheck,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingDown,
  Waves,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type {
  ScreeningField,
} from "@/features/screening/types/Screening";

type SectionCopy = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

type IconCard = {
  icon: LucideIcon;
  title: string;
  text: string;
  className?: string;
  highlight?: boolean;
  cyan?: boolean;
};

export const heroContent = {
  eyebrow: "Skrining Risiko Kardiovaskular Berbasis AI",
  title: "Kenali Risiko Jantung Lebih Awal",
  description:
    "CardioSense membantu pengguna memahami estimasi risiko penyakit kardiovaskular melalui data kesehatan sederhana, disertai edukasi pencegahan yang mudah dipahami.",
  primaryCta: "Mulai Skrining",
  secondaryCta: "Pelajari Kesehatan Jantung",
  visualLabel: "Status denyut",
  visualStatus: "stabil",
};

export const heroBadges = [
  { label: "Skrining Cepat", tone: "red" as const },
  { label: "Edukasi Praktis", tone: "cyan" as const },
  { label: "Fokus Pencegahan", tone: "red" as const },
];

export const heroMetrics = [
  {
    title: "Detak Jantung",
    value: "78 BPM",
    icon: HeartPulse,
    className: "left-3 top-8 sm:left-5 lg:-left-8",
    delay: 0,
  },
  {
    title: "Tekanan Darah",
    value: "Siap dicek",
    icon: Stethoscope,
    className: "right-3 top-24 sm:right-4 lg:-right-4",
    delay: 0.25,
  },
  {
    title: "Indikasi Risiko",
    value: "Siap",
    icon: ShieldCheck,
    className: "bottom-8 left-6 sm:left-14",
    delay: 0.45,
  },
];

export const problemContent: SectionCopy = {
  eyebrow: "Kesadaran awal",
  title: "Mengapa Skrining Dini Penting?",
  subtitle:
    "Risiko kardiovaskular sering berkembang secara perlahan. Dengan memahami faktor risiko lebih awal, pengguna dapat mengambil langkah pencegahan yang lebih tepat.",
};

export const problemCards: IconCard[] = [
  {
    icon: HeartPulse,
    title: "Gejala Sering Tidak Terlihat",
    text: "Sebagian risiko kardiovaskular dapat berkembang tanpa gejala awal yang jelas.",
  },
  {
    icon: ShieldCheck,
    title: "Faktor Risiko Bisa Dikendalikan",
    text: "Tekanan darah, kolesterol, kebiasaan merokok, aktivitas fisik, stres, dan pola makan dapat memengaruhi kesehatan jantung.",
  },
  {
    icon: Activity,
    title: "Kesadaran Membantu Pencegahan",
    text: "Skrining awal membantu pengguna memahami kapan perubahan gaya hidup atau konsultasi medis mulai diperlukan.",
  },
];

export const featuresContent: SectionCopy = {
  eyebrow: "Fitur utama",
  title: "Apa yang Disediakan CardioSense?",
  subtitle:
    "Alur skrining dan edukasi yang dirancang untuk membantu pengguna memahami indikasi risiko sejak awal dengan bahasa yang mudah dipahami.",
};

export const featureCards: IconCard[] = [
  {
    icon: ClipboardCheck,
    title: "Skrining Risiko",
    text: "Membantu memperkirakan risiko kardiovaskular berdasarkan data kesehatan dasar.",
    highlight: true,
  },
  {
    icon: Activity,
    title: "Penjelasan Faktor Risiko",
    text: "Menampilkan faktor yang kemungkinan berkontribusi terhadap hasil skrining.",
  },
  {
    icon: BookOpen,
    title: "Edukasi Kesehatan Jantung",
    text: "Menyediakan informasi tentang penyakit kardiovaskular, hipertensi, stroke, kolesterol, dan kebiasaan sehat.",
  },
  {
    icon: HeartHandshake,
    title: "Panduan Pencegahan",
    text: "Memberikan arahan umum untuk membangun pola hidup yang lebih sehat dan sadar risiko.",
  },
];

export const screeningContent = {
  eyebrow: "Skrining awal",
  title: "Mulai dari Data Kesehatan Sederhana",
  subtitle:
    "CardioSense menggunakan indikator kesehatan umum untuk memberikan gambaran awal mengenai risiko kardiovaskular.",
  formEyebrow: "Form skrining",
  formTitle: "Isi Data Kesehatan",
  formDescription:
    "Lengkapi data dasar berikut untuk mendapatkan estimasi risiko awal. Nilai tekanan darah menggunakan satuan mmHg.",
  submitLabel: "Cek Risiko",
  resetLabel: "Kosongkan Form",
  disclaimer:
    "CardioSense bukan alat diagnosis medis. Hasil skrining sebaiknya dikonsultasikan dengan tenaga kesehatan profesional.",
};

export const screeningFields: ScreeningField[] = [
  {
    name: "age",
    label: "Usia",
    type: "number",
    placeholder: "Contoh: 45",
    min: 18,
    max: 100,
    inputMode: "numeric",
  },
  {
    name: "gender",
    label: "Jenis Kelamin",
    type: "select",
    placeholder: "Pilih jenis kelamin",
    options: [
      { label: "Perempuan", value: "female" },
      { label: "Laki-laki", value: "male" },
      { label: "Tidak disebutkan", value: "unspecified" },
    ],
  },
  {
    name: "systolicPressure",
    label: "Tekanan Sistolik",
    type: "number",
    placeholder: "Contoh: 120",
    min: 80,
    max: 240,
    inputMode: "numeric",
  },
  {
    name: "diastolicPressure",
    label: "Tekanan Diastolik",
    type: "number",
    placeholder: "Contoh: 80",
    min: 50,
    max: 140,
    inputMode: "numeric",
  },
  {
    name: "cholesterol",
    label: "Kolesterol",
    type: "select",
    placeholder: "Pilih status kolesterol",
    options: [
      { label: "Normal", value: "normal" },
      { label: "Ambang batas", value: "borderline" },
      { label: "Tinggi", value: "high" },
      { label: "Belum tahu", value: "unknown" },
    ],
  },
  {
    name: "smokingStatus",
    label: "Status Merokok",
    type: "select",
    placeholder: "Pilih status merokok",
    options: [
      { label: "Tidak merokok", value: "never" },
      { label: "Pernah merokok", value: "former" },
      { label: "Masih merokok", value: "current" },
    ],
  },
  {
    name: "physicalActivity",
    label: "Aktivitas Fisik",
    type: "select",
    placeholder: "Pilih aktivitas fisik",
    options: [
      { label: "Rutin", value: "routine" },
      { label: "Kadang-kadang", value: "moderate" },
      { label: "Jarang", value: "rare" },
    ],
  },
  {
    name: "familyHistory",
    label: "Riwayat Keluarga",
    type: "select",
    placeholder: "Pilih riwayat keluarga",
    options: [
      { label: "Tidak ada", value: "no" },
      { label: "Ada", value: "yes" },
      { label: "Belum tahu", value: "unknown" },
    ],
  },
];

export const educationContent: SectionCopy = {
  eyebrow: "Edukasi",
  title: "Kenali Kesehatan Kardiovaskular",
  subtitle:
    "Memahami kondisi kardiovaskular membantu pengguna mengenali risiko dan mengambil keputusan kesehatan yang lebih baik.",
};

export const educationCards: IconCard[] = [
  {
    icon: HeartPulse,
    title: "Penyakit Jantung Koroner",
    text: "Kondisi yang berkaitan dengan berkurangnya aliran darah ke jantung, sering disebabkan oleh penyempitan pembuluh darah.",
  },
  {
    icon: Waves,
    title: "Hipertensi",
    text: "Tekanan darah tinggi dapat meningkatkan beban kerja jantung dan memperbesar risiko kardiovaskular.",
  },
  {
    icon: Brain,
    title: "Stroke",
    text: "Kondisi serius akibat gangguan aliran darah ke otak yang berkaitan erat dengan kesehatan pembuluh darah.",
  },
  {
    icon: HeartCrack,
    title: "Gagal Jantung",
    text: "Kondisi ketika jantung tidak mampu memompa darah seefektif kebutuhan tubuh.",
  },
];

export const educationLinkLabel = "Pelajari selengkapnya";

export const preventionContent: SectionCopy = {
  eyebrow: "Panduan pencegahan",
  title: "Bangun Kebiasaan yang Melindungi Jantung",
  subtitle:
    "Langkah kecil yang dilakukan konsisten dapat membantu menjaga kesehatan kardiovaskular dalam jangka panjang.",
};

export const preventionItems: IconCard[] = [
  {
    icon: Apple,
    title: "Nutrisi",
    text: "Konsumsi makanan bergizi seimbang",
  },
  {
    icon: ShieldCheck,
    title: "Asupan harian",
    text: "Kurangi garam, gula, dan lemak jenuh berlebih",
  },
  {
    icon: Dumbbell,
    title: "Aktivitas",
    text: "Lakukan aktivitas fisik secara rutin",
    cyan: true,
  },
  {
    icon: CigaretteOff,
    title: "Rokok",
    text: "Hindari kebiasaan merokok",
  },
  {
    icon: Sparkles,
    title: "Stres",
    text: "Kelola stres dengan baik",
    cyan: true,
  },
  {
    icon: Moon,
    title: "Istirahat",
    text: "Tidur cukup dan teratur",
  },
  {
    icon: Stethoscope,
    title: "Pemeriksaan",
    text: "Periksa tekanan darah dan kolesterol secara berkala",
  },
  {
    icon: ShieldCheck,
    title: "Konsultasi",
    text: "Konsultasikan risiko dengan tenaga kesehatan",
    cyan: true,
  },
];

export const highRiskContent: SectionCopy = {
  eyebrow: "Langkah berikutnya",
  title: "Jika Risiko Terlihat Tinggi, Ambil Langkah yang Tepat",
  subtitle:
    "Skrining sebaiknya membantu pengguna lebih waspada tanpa panik. Hasil risiko tinggi perlu ditindaklanjuti secara tepat.",
};

export const highRiskCards: IconCard[] = [
  {
    icon: ShieldAlert,
    title: "Jangan Panik",
    text: "Hasil skrining bukan diagnosis akhir, melainkan sinyal awal untuk lebih memperhatikan kondisi kesehatan.",
  },
  {
    icon: Stethoscope,
    title: "Konsultasi ke Tenaga Kesehatan",
    text: "Diskusikan hasil skrining dengan dokter atau tenaga kesehatan untuk pemeriksaan yang lebih tepat.",
  },
  {
    icon: TrendingDown,
    title: "Perbaiki Faktor Risiko",
    text: "Perubahan gaya hidup, pemantauan rutin, dan kepatuhan terhadap saran medis dapat membantu menurunkan risiko yang dapat dicegah.",
  },
];

export const highRiskDisclaimer =
  "Sinyal awal saja. Pemeriksaan profesional tetap penting.";

export const workflowContent: SectionCopy = {
  eyebrow: "Alur sederhana",
  title: "Cara Kerja CardioSense",
  subtitle:
    "Empat langkah ringkas dari pengisian data kesehatan hingga membaca edukasi dan panduan pencegahan.",
};

export const workflowSteps: IconCard[] = [
  { icon: ClipboardList, title: "Isi Data Kesehatan", text: "" },
  {
    icon: SearchCheck,
    title: "Sistem Meninjau Indikator Risiko",
    text: "",
  },
  { icon: HeartPulse, title: "Lihat Hasil Skrining", text: "" },
  {
    icon: BookOpen,
    title: "Baca Edukasi dan Panduan Pencegahan",
    text: "",
  },
];

export const faqContent = {
  title: "Pertanyaan yang Sering Diajukan",
};

export const ctaContent = {
  title: "Siap Mengenali Risiko Jantungmu?",
  description:
    "Mulai skrining awal dan pelajari cara menjaga kesehatan kardiovaskular melalui informasi yang mudah dipahami.",
  primaryCta: "Mulai Skrining",
  secondaryCta: "Lihat Tips Pencegahan",
};

export const footerContent = {
  description:
    "CardioSense adalah platform skrining awal dan edukasi kesehatan kardiovaskular untuk meningkatkan kesadaran risiko dan pencegahan.",
  linksTitle: "Tautan cepat",
  disclaimerTitle: "Disclaimer medis",
  disclaimer:
    "Informasi pada website ini bersifat edukatif dan tidak menggantikan saran medis, diagnosis, atau pengobatan dari tenaga kesehatan profesional.",
  copyright: "© 2026 CardioSense. Seluruh hak cipta dilindungi.",
};
