import type { ScreeningFactor } from "@/features/screening/types/Screening";
import { cn } from "@/lib/Utils";

type MetricProps = {
  factor: ScreeningFactor;
};

const toneClasses = {
  risk: "border-[#FAD7DD]/75 bg-[#FFF8F9] text-[#7F1D1D] [&>svg]:text-[#C51624]",
  protective:
    "border-[#22C55E]/25 bg-[#22C55E]/10 text-[#166534] [&>svg]:text-[#22C55E]",
  education:
    "border-[#FAD7DD]/75 bg-white text-[#374151] [&>svg]:text-[#C51624]",
} as const;

// Satu baris faktor risiko/edukasi yang berasal dari hasil olahan screening.
export function Metric({ factor }: MetricProps) {
  const Icon = factor.icon;
  const tone = factor.tone ?? "education";

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold leading-5",
        toneClasses[tone],
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      {factor.text}
    </div>
  );
}
