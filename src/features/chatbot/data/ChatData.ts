import type { ChatMessage } from "@/features/chatbot/types/Chatbot";

export const initialAssistantMessage: ChatMessage = {
  id: "assistant-welcome",
  role: "assistant",
  content:
    "Halo, saya Asisten CardioSense. Saya dapat membantu menjelaskan informasi umum tentang kesehatan jantung, faktor risiko, dan langkah pencegahan. Informasi ini bersifat edukatif dan bukan pengganti konsultasi medis profesional.",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
};

export const quickPrompts = [
  "Apa itu risiko kardiovaskular?",
  "Bagaimana cara mencegah penyakit jantung?",
  "Apa arti risiko sedang?",
  "Kapan harus konsultasi ke dokter?",
];

export function getMockAssistantResponse(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("nyeri dada") ||
    normalizedMessage.includes("sesak") ||
    normalizedMessage.includes("pingsan") ||
    normalizedMessage.includes("darurat")
  ) {
    return "Jika mengalami nyeri dada berat, sesak napas, pingsan, atau gejala darurat lainnya, segera hubungi layanan darurat atau fasilitas kesehatan terdekat.";
  }

  if (normalizedMessage.includes("risiko sedang")) {
    return "Risiko sedang berarti ada beberapa faktor yang perlu diperhatikan. Hasil ini bukan diagnosis, tetapi sinyal awal untuk memperbaiki gaya hidup dan mempertimbangkan konsultasi dengan tenaga kesehatan.";
  }

  if (
    normalizedMessage.includes("pencegahan") ||
    normalizedMessage.includes("mencegah")
  ) {
    return "Langkah pencegahan dapat dimulai dari pola makan seimbang, aktivitas fisik rutin, menghindari rokok, mengelola stres, tidur cukup, serta memeriksa tekanan darah dan kolesterol secara berkala.";
  }

  if (
    normalizedMessage.includes("dokter") ||
    normalizedMessage.includes("konsultasi")
  ) {
    return "Sebaiknya konsultasikan dengan tenaga kesehatan jika memiliki tekanan darah tinggi, nyeri dada, sesak napas, riwayat penyakit jantung keluarga, atau hasil skrining menunjukkan risiko tinggi.";
  }

  if (normalizedMessage.includes("risiko")) {
    return "Risiko kardiovaskular adalah kemungkinan seseorang mengalami gangguan pada jantung atau pembuluh darah. Faktor seperti tekanan darah, kolesterol, kebiasaan merokok, aktivitas fisik, dan riwayat keluarga dapat memengaruhi risiko tersebut.";
  }

  return "Saya dapat membantu memberikan informasi umum tentang kesehatan jantung, faktor risiko, pencegahan, dan langkah setelah skrining. Untuk keluhan medis spesifik, sebaiknya konsultasikan langsung dengan tenaga kesehatan profesional.";
}
