import type { ScreeningFactor } from "@/features/screening/types/Screening";

type MetricProps = {
  factor: ScreeningFactor;
};

export function Metric({ factor }: MetricProps) {
  const Icon = factor.icon;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#FAD7DD]/75 bg-white px-4 py-3 text-sm font-semibold text-[#374151]">
      <Icon className="size-4 text-[#C51624]" />
      {factor.text}
    </div>
  );
}
