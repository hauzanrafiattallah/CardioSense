"use client";

import { motion } from "framer-motion";
import { CircleGauge, ClipboardCheck } from "lucide-react";

import { RiskBadge } from "@/components/shared/RiskBadge";
import { Card } from "@/components/ui/card";
import { Metric } from "@/features/screening/components/Metric";
import type { ScreeningResult } from "@/features/screening/types/Screening";
import { getRiskLevelMeta } from "@/features/screening/utils/Risk";
import { cn } from "@/lib/Utils";

type ResultProps = {
  result: ScreeningResult | null;
  hasSubmitted: boolean;
};

export function Result({ result, hasSubmitted }: ResultProps) {
  if (!result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="h-full"
      >
        <Card className="relative h-full overflow-hidden p-6">
          <div
            className="absolute -right-14 -top-12 size-44 rounded-[4rem] bg-[#FAD7DD]/65"
            aria-hidden="true"
          />
          <div className="relative flex h-full flex-col">
            {/* Header */}
            <div className="mb-5 flex size-16 items-center justify-center rounded-3xl bg-[#FFF1F3] text-[#C51624]">
              <ClipboardCheck className="size-8" />
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#C51624]">
              Hasil skrining
            </p>
            <h3 className="mt-2 font-heading text-3xl font-bold text-[#111418]">
              {hasSubmitted ? "Lengkapi data yang diperlukan" : "Siap Dicek"}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#6B7280]">
              Isi form di sebelah kiri, lalu klik{" "}
              <span className="font-semibold text-[#C51624]">Cek Risiko</span>{" "}
              untuk melihat estimasi risiko awal dan faktor yang perlu
              diperhatikan.
            </p>

            {/* Risk level preview */}
            <div className="mt-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#9CA3AF]">
                Kategori hasil estimasi
              </p>
              <div className="grid gap-2">
                {[
                  {
                    dot: "bg-[#22C55E]",
                    bg: "bg-[#22C55E]/8 border-[#22C55E]/20",
                    label: "Risiko Rendah",
                    desc: "Profil kesehatan baik, pertahankan gaya hidup sehat.",
                    text: "text-[#166534]",
                  },
                  {
                    dot: "bg-[#F59E0B]",
                    bg: "bg-[#F59E0B]/8 border-[#F59E0B]/20",
                    label: "Risiko Sedang",
                    desc: "Ada faktor yang perlu diperhatikan dan dipantau.",
                    text: "text-[#92400E]",
                  },
                  {
                    dot: "bg-[#C51624]",
                    bg: "bg-[#C51624]/8 border-[#C51624]/20",
                    label: "Risiko Tinggi",
                    desc: "Segera konsultasi dengan tenaga medis profesional.",
                    text: "text-[#7F1D1D]",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border px-4 py-3",
                      item.bg,
                    )}
                  >
                    <span
                      className={cn(
                        "mt-1.5 size-2 shrink-0 rounded-full",
                        item.dot,
                      )}
                    />
                    <div>
                      <p
                        className={cn(
                          "text-xs font-bold uppercase tracking-wide",
                          item.text,
                        )}
                      >
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-xs leading-5 text-[#6B7280]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-auto pt-5">
              <div className="rounded-2xl border border-[#FAD7DD]/80 bg-[#FFF8F9] px-4 py-3 text-xs leading-5 text-[#9CA3AF]">
                ⚠️ Hasil bersifat edukatif. Bukan pengganti diagnosis medis
                profesional.
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  const riskMeta = getRiskLevelMeta(result.level);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 24 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Card className="relative h-full overflow-hidden p-6">
        <div
          className="absolute -right-14 -top-12 size-44 rounded-[4rem] bg-[#FAD7DD]/65"
          aria-hidden="true"
        />
        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#C51624]">
                {result.eyebrow}
              </p>
              <h3 className="mt-2 font-heading text-3xl font-bold text-[#111418]">
                {result.title}
              </h3>
              <RiskBadge tone={riskMeta.tone} className="mt-3">
                {riskMeta.label}
              </RiskBadge>
            </div>
            <div
              className={cn(
                "flex size-14 items-center justify-center rounded-3xl",
                riskMeta.iconClassName,
              )}
            >
              <CircleGauge className="size-7" />
            </div>
          </div>

          <div className="mt-8 rounded-4xl bg-[#FFF8F9] p-5">
            <div className="mb-3 flex items-center justify-between text-sm font-semibold">
              <span className="text-[#374151]">{result.overviewLabel}</span>
              <span className="text-[#C51624]">{result.percentage}%</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-[#FAD7DD]">
              <motion.div
                initial={{ width: "0%" }}
                whileInView={{ width: `${result.percentage}%` }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full",
                  riskMeta.progressClassName,
                )}
              />
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {result.factors.length > 0 ? (
              result.factors.map((factor) => (
                <Metric key={factor.text} factor={factor} />
              ))
            ) : (
              <div className="rounded-2xl border border-[#22C55E]/25 bg-[#22C55E]/10 px-4 py-3 text-sm font-semibold text-[#166534]">
                Tidak ada faktor dominan dari data yang diisi. Tetap lanjutkan
                kebiasaan sehat dan pemantauan berkala.
              </div>
            )}
          </div>

          <p className="mt-5 rounded-2xl bg-[#35B8E5]/10 p-4 text-sm leading-6 text-[#374151]">
            {result.summary}
          </p>

          <p className="mt-4 rounded-2xl border border-[#FAD7DD]/80 bg-white p-4 text-sm leading-6 text-[#374151]">
            {result.recommendation}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
