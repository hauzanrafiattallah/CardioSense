import { cn } from "@/lib/Utils";

type RiskBadgeTone = "red" | "cyan" | "amber" | "green" | "light";

type RiskBadgeProps = {
  children: React.ReactNode;
  tone?: RiskBadgeTone;
  className?: string;
};

const toneClasses: Record<RiskBadgeTone, string> = {
  red: "border-[#FAD7DD]/80 bg-white/78 text-[#374151] [&>span]:bg-[#F43F4E]",
  cyan: "border-[#35B8E5]/25 bg-white/78 text-[#374151] [&>span]:bg-[#35B8E5]",
  amber:
    "border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#92400E] [&>span]:bg-[#F59E0B]",
  green:
    "border-[#22C55E]/25 bg-[#22C55E]/10 text-[#166534] [&>span]:bg-[#22C55E]",
  light: "border-white/20 bg-white/12 text-white [&>span]:bg-white",
};

export function RiskBadge({
  children,
  tone = "red",
  className,
}: RiskBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-sm",
        toneClasses[tone],
        className,
      )}
    >
      <span className="size-2.5 rounded-full" />
      {children}
    </span>
  );
}
