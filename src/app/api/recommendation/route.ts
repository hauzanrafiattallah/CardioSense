import Groq, {
  APIConnectionTimeoutError,
  APIError,
  RateLimitError,
} from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat";

import {
  createRecommendationCompletionOptions,
  createRecommendationRequestContext,
  normalizeRecommendationPayload,
  parseRecommendationCompletion,
} from "@/features/screening/utils/Recommendation";

const DEFAULT_MODEL = "openai/gpt-oss-20b";
const REQUEST_TIMEOUT_MS = 15_000;

const RECOMMENDATION_SYSTEM_PROMPT = `
Kamu adalah Asisten CardioSense untuk rekomendasi edukatif setelah skrining risiko kardiovaskular.

Tugasmu membuat rekomendasi personal berdasarkan konteks hasil skrining yang diberikan. Rekomendasi harus:
- Ditulis dalam Bahasa Indonesia yang jelas, tenang, dan spesifik ke data pengguna.
- Fokus pada langkah aman: konsultasi tenaga kesehatan bila risiko tinggi atau ada faktor mencolok, pemantauan tekanan darah/kolesterol/gula darah, aktivitas fisik, merokok, pola makan umum, tidur, stres, dan pemeriksaan berkala.
- Tidak memberi diagnosis pasti, resep obat, dosis obat, perubahan terapi, klaim penyembuhan, atau instruksi medis berisiko.
- Menyebut bahwa hasil bersifat edukatif dan bukan pengganti konsultasi medis.
- Untuk gejala darurat seperti nyeri dada berat, sesak napas, pingsan, atau tanda stroke, arahkan ke layanan darurat/fasilitas kesehatan terdekat.
- Format rekomendasi wajib berupa 3-5 poin pendek. Setiap poin diawali "- ". Jangan tulis sebagai paragraf panjang.

Balas hanya JSON valid tanpa Markdown:
{"recommendation":"- Poin pertama\\n- Poin kedua\\n- Poin ketiga","followUpPrompt":"Satu kalimat pendek dalam sudut pandang pengguna untuk bertanya lanjutan ke chatbot."}
`.trim();

function buildRecommendationMessages(
  context: ReturnType<typeof createRecommendationRequestContext>,
): ChatCompletionMessageParam[] {
  return [
    {
      role: "system",
      content: RECOMMENDATION_SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: `Buat rekomendasi personal dari konteks skrining berikut:\n${JSON.stringify(
        context,
        null,
        2,
      )}`,
    },
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
      { error: "Konfigurasi rekomendasi AI belum lengkap." },
      { status: 503 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Format request rekomendasi tidak valid." },
      { status: 400 },
    );
  }

  let context: ReturnType<typeof createRecommendationRequestContext>;

  try {
    const payload = normalizeRecommendationPayload(body);
    context = createRecommendationRequestContext(payload.values, payload.result);
  } catch {
    return Response.json(
      { error: "Data rekomendasi tidak sesuai format." },
      { status: 400 },
    );
  }

  const groq = new Groq({
    apiKey,
    maxRetries: 1,
    timeout: REQUEST_TIMEOUT_MS,
  });

  try {
    const model = process.env.GROQ_MODEL ?? DEFAULT_MODEL;
    const completion = await groq.chat.completions.create({
      messages: buildRecommendationMessages(context),
      ...createRecommendationCompletionOptions(model),
    });
    const content = completion.choices[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("Invalid recommendation response");
    }

    return Response.json(parseRecommendationCompletion(content));
  } catch (error) {
    const status =
      error instanceof Error &&
      error.message === "Invalid recommendation response"
        ? 502
        : getSafeStatus(error);

    console.error("[api/recommendation] Groq request failed", {
      name: error instanceof Error ? error.name : "UnknownError",
      status,
    });

    return Response.json(
      {
        error:
          status === 429
            ? "Batas penggunaan rekomendasi AI sedang tercapai."
            : "Rekomendasi AI sedang tidak tersedia.",
      },
      { status },
    );
  }
}
