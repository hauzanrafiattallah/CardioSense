import Groq, {
  APIConnectionTimeoutError,
  APIError,
  RateLimitError,
} from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat";

import type { ChatRole } from "@/features/chatbot/types/Chatbot";

const MAX_HISTORY_MESSAGES = 8;
const MAX_MESSAGE_LENGTH = 900;
const DEFAULT_MODEL = "openai/gpt-oss-20b";
const REQUEST_TIMEOUT_MS = 15_000;

const CARDIOSENSE_SYSTEM_PROMPT = `
Kamu adalah Asisten CardioSense untuk website skrining awal dan edukasi kesehatan kardiovaskular.

Jawab hanya dalam ranah CardioSense: kesehatan jantung dan pembuluh darah, hipertensi, kolesterol, stroke, gagal jantung, faktor risiko, merokok, aktivitas fisik, nutrisi umum, pola tidur, stres, riwayat keluarga, pencegahan, interpretasi edukatif hasil skrining rendah/sedang/tinggi, dan kapan perlu konsultasi ke tenaga kesehatan.

Gunakan konteks fakta dasar ini sebagai rujukan:
- Jantung adalah organ otot kira-kira sebesar kepalan tangan yang berada di rongga dada, sedikit ke kiri dari tengah dada, dan bekerja memompa darah.
- Darah membawa oksigen dan nutrisi ke jaringan tubuh, lalu membawa sisa metabolisme untuk diproses organ lain.
- Risiko kardiovaskular adalah estimasi kemungkinan gangguan jantung atau pembuluh darah, bukan diagnosis.
- Faktor risiko yang umum dibahas CardioSense meliputi tekanan darah, kolesterol, merokok, aktivitas fisik, riwayat keluarga, usia, dan pola hidup.
- Pencegahan umum mencakup pola makan seimbang, aktivitas fisik rutin, menghindari rokok, tidur cukup, mengelola stres, dan pemeriksaan tekanan darah atau kolesterol berkala.

Jika pertanyaan keluar dari ranah itu, tolak dengan sopan dan arahkan kembali ke topik CardioSense. Jangan membantu coding, tugas sekolah umum, finansial, hukum, hiburan, atau topik non-kardiovaskular.

Jangan memberi diagnosis pasti, resep obat, dosis obat, perubahan terapi, atau keputusan medis personal. Untuk gejala darurat seperti nyeri dada berat, sesak napas, pingsan, tanda stroke, atau kondisi yang terasa mengancam nyawa, arahkan pengguna untuk segera menghubungi layanan darurat atau fasilitas kesehatan terdekat.

Gunakan Bahasa Indonesia yang jelas, ringkas, dan menenangkan. Jelaskan bahwa informasi bersifat edukatif dan bukan pengganti konsultasi tenaga kesehatan bila konteksnya medis.

Format jawaban harus rapi untuk bubble chat: gunakan 1-3 paragraf pendek atau bullet singkat. Jangan gunakan tabel Markdown. Hindari heading besar. Batasi jawaban sekitar 120 kata kecuali pengguna meminta detail.
`.trim();

const DOMAIN_TERMS = [
  "cardiosense",
  "jantung",
  "kardiovaskular",
  "kardio",
  "pembuluh darah",
  "darah tinggi",
  "tekanan",
  "tekanan darah",
  "tensi",
  "sistolik",
  "diastolik",
  "hipertensi",
  "kolesterol",
  "stroke",
  "gagal jantung",
  "koroner",
  "detak",
  "denyut",
  "bpm",
  "risiko",
  "skrining",
  "screening",
  "rendah",
  "sedang",
  "tinggi",
  "merokok",
  "rokok",
  "aktivitas fisik",
  "olahraga",
  "nutrisi",
  "makanan",
  "garam",
  "lemak",
  "gula darah",
  "diabetes",
  "obesitas",
  "berat badan",
  "stres",
  "tidur",
  "riwayat keluarga",
  "pencegahan",
  "mencegah",
  "dokter",
  "konsultasi",
  "dada",
  "nadi",
  "nyeri dada",
  "sesak",
  "pingsan",
  "darurat",
] as const;

const CONTEXTUAL_FOLLOW_UP_TERMS = [
  "itu",
  "ini",
  "saya",
  "aku",
  "hasil",
  "aman",
  "normal",
  "kenapa",
  "mengapa",
  "bagaimana",
  "apa",
  "kapan",
  "boleh",
  "harus",
] as const;

const CLEARLY_OUT_OF_SCOPE_TERMS = [
  "kode",
  "coding",
  "javascript",
  "typescript",
  "python",
  "html",
  "css",
  "next.js",
  "react",
  "crypto",
  "saham",
  "film",
  "game",
  "lagu",
  "politik",
  "hukum",
  "kontrak",
  "essay",
  "matematika",
] as const;

const GREETING_TERMS = [
  "halo",
  "hai",
  "hello",
  "hi",
  "pagi",
  "siang",
  "sore",
  "malam",
  "terima kasih",
  "makasih",
] as const;

type IncomingChatMessage = {
  role: ChatRole;
  content: string;
};

type ChatRequestBody = {
  messages?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeText(value: string) {
  return value.toLowerCase();
}

function containsAnyTerm(value: string, terms: readonly string[]) {
  const normalizedValue = normalizeText(value);

  return terms.some((term) => normalizedValue.includes(term));
}

function sanitizeMessages(messages: unknown): IncomingChatMessage[] {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter((message): message is Record<string, unknown> => isRecord(message))
    .map((message): IncomingChatMessage => {
      const role = message.role === "assistant" ? "assistant" : "user";
      const content =
        typeof message.content === "string"
          ? message.content.trim().slice(0, MAX_MESSAGE_LENGTH)
          : "";

      return { role, content };
    })
    .filter((message) => message.content.length > 0)
    .slice(-MAX_HISTORY_MESSAGES);
}

function getLatestUserMessage(messages: IncomingChatMessage[]) {
  return [...messages].reverse().find((message) => message.role === "user");
}

function shouldAnswerWithinCardioSense(messages: IncomingChatMessage[]) {
  const latestUserMessage = getLatestUserMessage(messages);

  if (!latestUserMessage) {
    return false;
  }

  const latestContent = latestUserMessage.content;

  if (containsAnyTerm(latestContent, CLEARLY_OUT_OF_SCOPE_TERMS)) {
    return false;
  }

  if (
    containsAnyTerm(latestContent, DOMAIN_TERMS) ||
    containsAnyTerm(latestContent, GREETING_TERMS)
  ) {
    return true;
  }

  const recentUserMessages = messages
    .filter((message) => message.role === "user")
    .slice(-3);
  const recentContext = recentUserMessages
    .map((message) => message.content)
    .join(" ");

  return (
    containsAnyTerm(recentContext, DOMAIN_TERMS) &&
    containsAnyTerm(latestContent, CONTEXTUAL_FOLLOW_UP_TERMS)
  );
}

function buildGroqMessages(
  messages: IncomingChatMessage[],
): ChatCompletionMessageParam[] {
  return [
    {
      role: "system",
      content: CARDIOSENSE_SYSTEM_PROMPT,
    },
    ...messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ];
}

function getSafeStatus(error: unknown) {
  if (error instanceof RateLimitError) {
    return 429;
  }

  if (error instanceof APIConnectionTimeoutError) {
    return 504;
  }

  if (error instanceof APIError) {
    return error.status ?? 502;
  }

  return 500;
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "Konfigurasi chatbot belum lengkap." },
      { status: 503 },
    );
  }

  let body: ChatRequestBody;

  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return Response.json(
      { error: "Format request chatbot tidak valid." },
      { status: 400 },
    );
  }

  const sanitizedMessages = sanitizeMessages(body.messages);

  if (!getLatestUserMessage(sanitizedMessages)) {
    return Response.json(
      { error: "Pesan pengguna wajib diisi." },
      { status: 400 },
    );
  }

  if (!shouldAnswerWithinCardioSense(sanitizedMessages)) {
    return Response.json({
      message:
        "Maaf, saya hanya bisa membantu topik seputar CardioSense, skrining awal, faktor risiko, pencegahan, dan edukasi kesehatan kardiovaskular.",
    });
  }

  const groq = new Groq({
    apiKey,
    maxRetries: 1,
    timeout: REQUEST_TIMEOUT_MS,
  });

  try {
    const completion = await groq.chat.completions.create({
      messages: buildGroqMessages(sanitizedMessages),
      model: process.env.GROQ_MODEL ?? DEFAULT_MODEL,
      max_completion_tokens: 450,
      temperature: 0.2,
    });

    const message = completion.choices[0]?.message?.content?.trim();

    return Response.json({
      message:
        message ||
        "Maaf, saya belum bisa menjawab saat ini. Untuk keluhan medis, konsultasikan langsung dengan tenaga kesehatan.",
    });
  } catch (error) {
    const status = getSafeStatus(error);

    console.error("[api/chat] Groq request failed", {
      name: error instanceof Error ? error.name : "UnknownError",
      status,
    });

    return Response.json(
      {
        error:
          status === 429
            ? "Batas penggunaan chatbot sedang tercapai."
            : "Chatbot sedang tidak tersedia.",
      },
      { status },
    );
  }
}
