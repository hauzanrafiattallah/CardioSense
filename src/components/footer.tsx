import { HeartPulse } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Screening", href: "#screening" },
  { label: "Education", href: "#education" },
  { label: "Prevention", href: "#prevention" },
  { label: "FAQ", href: "#faq" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#FAD7DD]/80 bg-[#111418] py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.8fr_1.1fr] lg:px-8">
        <div>
          <a href="#home" className="inline-flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-[#C51624] text-white">
              <HeartPulse className="size-6" />
            </span>
            <span className="font-heading text-xl font-bold">CardioSense</span>
          </a>
          <p className="mt-5 max-w-sm leading-7 text-white/68">
            A cardiovascular risk screening and education platform for early
            awareness and prevention.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-base font-semibold">Quick links</h3>
          <div className="mt-4 grid gap-3">
            {quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-white/68 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading text-base font-semibold">
            Medical disclaimer
          </h3>
          <p className="mt-4 rounded-3xl border border-white/10 bg-white/6 p-5 text-sm leading-7 text-white/68">
            This website provides educational information and early screening
            support only. It is not intended to replace professional medical
            advice, diagnosis, or treatment.
          </p>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl px-4 text-sm text-white/48 sm:px-6 lg:px-8">
        © 2026 CardioSense. All rights reserved.
      </div>
    </footer>
  );
}
