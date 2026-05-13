import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  dark = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-3xl",
        align === "center" ? "text-center" : "mx-0 text-left",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-4 inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]",
            dark
              ? "bg-white/15 text-white"
              : "bg-[#FFF1F3] text-[#C51624]",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "text-balance font-heading text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl",
          dark ? "text-white" : "text-[#111418]",
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "mt-5 text-base leading-8 sm:text-lg",
            dark ? "text-white/78" : "text-[#6B7280]",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
