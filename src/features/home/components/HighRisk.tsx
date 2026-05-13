"use client";

import { motion } from "framer-motion";
import { HeartPulse } from "lucide-react";

import { MotionCard } from "@/components/shared/MotionCard";
import { SectionTitle } from "@/components/shared/SectionTitle";
import {
  highRiskCards,
  highRiskContent,
  highRiskDisclaimer,
} from "@/features/home/data/HomeData";

export function HighRisk() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24" style={{ background: "linear-gradient(135deg, #E8293A 0%, #C51624 50%, #D12232 100%)" }}>
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.20),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(255,200,200,0.12),transparent_55%)]"
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
            eyebrow={highRiskContent.eyebrow}
            title={highRiskContent.title}
            subtitle={highRiskContent.subtitle}
            dark
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="mt-12 grid gap-5 md:grid-cols-3"
        >
          {highRiskCards.map((action) => {
            const Icon = action.icon;

            return (
              <MotionCard
                key={action.title}
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="rounded-3xl border border-white/22 bg-white/95 p-7 shadow-[0_24px_80px_rgba(17,20,24,0.18)]"
              >
                <div className="mb-6 flex size-14 items-center justify-center rounded-3xl bg-[#FFF1F3] text-[#C51624]">
                  <Icon className="size-7" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[#111418]">
                  {action.title}
                </h3>
                <p className="mt-4 leading-7 text-[#6B7280]">{action.text}</p>
              </MotionCard>
            );
          })}
        </motion.div>

        <div className="mt-10 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/12 px-5 py-3 text-sm font-semibold text-white backdrop-blur">
            <HeartPulse className="size-5" />
            {highRiskDisclaimer}
          </div>
        </div>
      </div>
    </section>
  );
}
