"use client";

import { motion } from "framer-motion";
import { HeartPulse, ShieldAlert, Stethoscope, TrendingDown } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";

const actions = [
  {
    icon: ShieldAlert,
    title: "Do Not Panic",
    text: "A screening result is not a final diagnosis. It is an early signal to pay attention.",
  },
  {
    icon: Stethoscope,
    title: "Consult a Professional",
    text: "Discuss your result with a doctor or qualified healthcare provider for proper assessment.",
  },
  {
    icon: TrendingDown,
    title: "Improve Risk Factors",
    text: "Lifestyle changes and routine monitoring can help reduce preventable risks.",
  },
];

export function HighRiskSection() {
  return (
    <section className="relative overflow-hidden bg-[#C51624] py-20 sm:py-24">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_34%),linear-gradient(135deg,#C51624_0%,#9E111C_100%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
        >
          <SectionHeading
            eyebrow="Next step"
            title="If Your Risk Looks High, Take the Right Next Step"
            subtitle="Screening should create clarity, not fear. CardioSense frames higher risk as a signal to follow up thoughtfully."
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
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="rounded-3xl border border-white/22 bg-white/95 p-7 shadow-[0_24px_80px_rgba(17,20,24,0.18)]"
              >
                <div className="mb-6 flex size-14 items-center justify-center rounded-3xl bg-[#FFF1F3] text-[#C51624]">
                  <Icon className="size-7" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[#111418]">
                  {action.title}
                </h3>
                <p className="mt-4 leading-7 text-[#6B7280]">{action.text}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-10 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/12 px-5 py-3 text-sm font-semibold text-white backdrop-blur">
            <HeartPulse className="size-5" />
            Early signal only. Professional evaluation matters.
          </div>
        </div>
      </div>
    </section>
  );
}
