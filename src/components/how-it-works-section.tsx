"use client";

import { motion } from "framer-motion";
import { BookOpen, ClipboardList, HeartPulse, SearchCheck } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";

const steps = [
  {
    icon: ClipboardList,
    title: "Enter Health Data",
  },
  {
    icon: SearchCheck,
    title: "System Reviews Risk Indicators",
  },
  {
    icon: HeartPulse,
    title: "View Screening Result",
  },
  {
    icon: BookOpen,
    title: "Read Education and Prevention Guidance",
  },
];

export function HowItWorksSection() {
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
            eyebrow="Simple flow"
            title="How CardioSense Works"
            subtitle="A calm four-step journey from health indicators to educational guidance."
          />
        </motion.div>

        <div className="relative mt-14">
          <div
            className="absolute left-7 top-0 h-full w-1 rounded-full bg-[#FAD7DD] lg:left-0 lg:top-[5.75rem] lg:h-1 lg:w-full"
            aria-hidden="true"
          />
          <motion.div
            initial={{ scaleY: 0, scaleX: 1 }}
            whileInView={{ scaleY: 1, scaleX: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute left-7 top-0 h-full w-1 origin-top rounded-full bg-[#C51624] lg:left-0 lg:top-[5.75rem] lg:h-1 lg:w-full lg:origin-left lg:[transform:scaleX(var(--tw-scale-x))_scaleY(var(--tw-scale-y))]"
            aria-hidden="true"
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
            className="grid gap-6 lg:grid-cols-4"
          >
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  variants={{
                    hidden: { opacity: 0, y: 28 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5 }}
                  className="relative flex gap-5 rounded-3xl border border-[#FAD7DD]/80 bg-[#FFF8F9] p-5 shadow-[0_18px_50px_rgba(197,22,36,0.07)] lg:block lg:bg-white lg:text-center"
                >
                  <div className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-3xl bg-[#C51624] text-white shadow-[0_16px_34px_rgba(197,22,36,0.22)] lg:mx-auto lg:mb-7">
                    <Icon className="size-7" />
                  </div>
                  <div>
                    <div className="mb-2 inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-[#C51624] lg:bg-[#FFF1F3]">
                      Step {index + 1}
                    </div>
                    <h3 className="font-heading text-xl font-bold leading-tight text-[#111418]">
                      {step.title}
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
