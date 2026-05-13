"use client";

import { motion } from "framer-motion";
import { Activity, HeartPulse, ShieldCheck } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";

const cards = [
  {
    icon: HeartPulse,
    title: "Symptoms Are Often Silent",
    text: "Some cardiovascular risks can progress without obvious early symptoms.",
  },
  {
    icon: ShieldCheck,
    title: "Risk Factors Can Be Managed",
    text: "Blood pressure, cholesterol, smoking, activity level, stress, and diet can influence long-term heart health.",
  },
  {
    icon: Activity,
    title: "Awareness Supports Prevention",
    text: "Early screening helps users understand when lifestyle changes or medical consultation may be needed.",
  },
];

export function WhyScreeningSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
        >
          <SectionHeading
            eyebrow="Early awareness"
            title="Why Early Screening Matters"
            subtitle="Cardiovascular problems often develop gradually. Understanding risk factors early can help users take preventive action sooner."
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
          className="mt-12 grid gap-5 md:grid-cols-3"
        >
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8 }}
              >
                <Card className="group h-full p-7">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    className="mb-6 flex size-14 items-center justify-center rounded-3xl bg-[#FFF1F3] text-[#C51624] shadow-[0_14px_30px_rgba(197,22,36,0.08)]"
                  >
                    <Icon className="size-7 transition-transform duration-300 group-hover:scale-110" />
                  </motion.div>
                  <h3 className="font-heading text-xl font-bold text-[#111418]">
                    {card.title}
                  </h3>
                  <p className="mt-4 leading-7 text-[#6B7280]">{card.text}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
