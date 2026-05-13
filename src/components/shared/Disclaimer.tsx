import { Info } from "lucide-react";

import { cn } from "@/lib/Utils";

type DisclaimerProps = {
  children: React.ReactNode;
  variant?: "soft" | "dark";
  className?: string;
};

export function Disclaimer({
  children,
  variant = "soft",
  className,
}: DisclaimerProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-3xl text-sm leading-6",
        variant === "dark"
          ? "border border-white/10 bg-white/6 p-5 text-white/68"
          : "border border-[#FAD7DD]/80 bg-[#FFF1F3] p-4 text-[#6B7280]",
        className,
      )}
    >
      <Info
        className={cn(
          "mt-0.5 size-5 shrink-0",
          variant === "dark" ? "text-white/78" : "text-[#C51624]",
        )}
      />
      <p>{children}</p>
    </div>
  );
}
