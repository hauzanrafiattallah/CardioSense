import { HeartPulse } from "lucide-react";

import { Disclaimer } from "@/components/shared/Disclaimer";
import { footerContent } from "@/features/home/data/HomeData";
import { footerLinks } from "@/features/home/data/NavData";

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
            {footerContent.description}
          </p>
        </div>

        <div>
          <h3 className="font-heading text-base font-semibold">
            {footerContent.linksTitle}
          </h3>
          <div className="mt-4 grid gap-3">
            {footerLinks.map((link) => (
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
            {footerContent.disclaimerTitle}
          </h3>
          <Disclaimer variant="dark" className="mt-4">
            {footerContent.disclaimer}
          </Disclaimer>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl px-4 text-sm text-white/48 sm:px-6 lg:px-8">
        {footerContent.copyright}
      </div>
    </footer>
  );
}
