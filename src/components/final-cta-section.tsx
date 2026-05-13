"use client";

import { motion } from "framer-motion";
import { ArrowRight, HeartPulse, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 28 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2.25rem] bg-[linear-gradient(135deg,#FFF1F3_0%,#FAD7DD_42%,#F43F4E_100%)] p-5 shadow-[0_34px_90px_rgba(197,22,36,0.16)] sm:p-8 lg:p-10"
        >
          <div
            className="absolute right-8 top-8 size-28 rounded-[3rem] border border-white/35 bg-white/16"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-8 left-8 h-16 w-28 -rotate-6 rounded-[2.5rem] border border-white/35 bg-white/18"
            aria-hidden="true"
          />
          <div className="relative rounded-[1.75rem] border border-white/70 bg-white/82 p-7 backdrop-blur-xl sm:p-10 lg:p-12">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-3xl bg-[#C51624] text-white shadow-[0_18px_38px_rgba(197,22,36,0.24)]">
                <HeartPulse className="size-8" />
              </div>
              <h2 className="text-balance font-heading text-3xl font-bold leading-tight text-[#111418] sm:text-4xl lg:text-5xl">
                Ready to Understand Your Heart Risk?
              </h2>
              <p className="mt-5 text-base leading-8 text-[#6B7280] sm:text-lg">
                Start with a simple screening experience and learn how to
                protect your cardiovascular health through better daily habits.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <a href="#screening">
                    Start Screening
                    <ArrowRight />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  <a href="#prevention">
                    View Prevention Tips
                    <ShieldCheck />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
