"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

import { SectionTitle } from "@/components/shared/SectionTitle";
import { Card } from "@/components/ui/card";
import { featureCards, featuresContent } from "@/features/home/data/HomeData";
import { cn } from "@/lib/Utils";

export function Features() {
  const [highlight, ...rest] = featureCards;
  const HighlightIcon = highlight.icon;

  return (
    <section className="relative overflow-hidden bg-[#FFF1F3] py-20 sm:py-24">
      <div
        className="absolute inset-x-8 top-16 h-24 rounded-[3rem] bg-white/55 blur-2xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
        >
          <SectionTitle
            eyebrow={featuresContent.eyebrow}
            title={featuresContent.title}
            subtitle={featuresContent.subtitle}
          />
        </motion.div>

        {/* Bento Grid: featured card left full-height, 3 cards right */}
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {/* ── Featured / Highlight Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
          >
            <Card className="relative flex h-full min-h-90 flex-col justify-between overflow-hidden bg-[linear-gradient(145deg,#C51624_0%,#E8293A_60%,#F43F4E_100%)] p-8 text-white">
              {/* Decorative glows */}
              <div
                className="absolute -right-12 -top-12 size-52 rounded-full bg-white/10 blur-2xl"
                aria-hidden="true"
              />
              <div
                className="absolute right-8 top-8 size-20 rounded-full border border-white/20 bg-white/8"
                aria-hidden="true"
              />
              <div
                className="absolute right-20 top-20 size-10 rounded-full border border-white/15 bg-white/6"
                aria-hidden="true"
              />

              <div className="relative flex flex-1 flex-col">
                <div className="mb-6 flex size-14 items-center justify-center rounded-3xl bg-white/20 text-white">
                  <HighlightIcon className="size-7" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-white">
                  {highlight.title}
                </h3>
                <p className="mt-3 leading-7 text-white/82">{highlight.text}</p>

                {/* List keunggulan fitur */}
                <div className="my-6 grid gap-2.5">
                  {[
                    "Analisis parameter instan berbasis AI",
                    "Memetakan 6+ indikator kesehatan utama",
                    "Rekomendasi gaya hidup & pencegahan",
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white/90 backdrop-blur-sm"
                    >
                      <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold text-white">
                        ✓
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto flex items-center gap-3 rounded-2xl bg-white/15 p-4 text-sm font-semibold text-white backdrop-blur">
                  <ShieldCheck className="size-5 shrink-0" />
                  Indikator awal, bukan diagnosis
                </div>
              </div>
            </Card>
          </motion.div>

          {/* ── Right side: 3 cards — top 2 side-by-side, bottom full-width ── */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {rest.map((feature, index) => {
              const Icon = feature.icon;
              const isLast = index === rest.length - 1;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                  className={cn(isLast ? "sm:col-span-2" : "")}
                >
                  <Card className="relative h-full overflow-hidden p-7">
                    <div
                      className={cn(
                        "mb-5 flex size-12 items-center justify-center rounded-2xl",
                        index === 1
                          ? "bg-[#35B8E5]/12 text-[#35B8E5]"
                          : "bg-[#FFF1F3] text-[#C51624]",
                      )}
                    >
                      <Icon className="size-6" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-[#111418]">
                      {feature.title}
                    </h3>
                    <p className="mt-3 leading-7 text-[#6B7280]">{feature.text}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
