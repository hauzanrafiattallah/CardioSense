"use client";

import { motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  CircleGauge,
  HeartPulse,
  Info,
  ShieldCheck,
} from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";

const fields = [
  "Age",
  "Gender",
  "Blood Pressure",
  "Cholesterol",
  "Smoking Status",
  "Physical Activity",
  "Family History",
];

function MockHealthForm() {
  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#C51624]">
            Screening inputs
          </p>
          <h3 className="mt-2 font-heading text-2xl font-bold text-[#111418]">
            Health Snapshot
          </h3>
        </div>
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#FFF1F3] text-[#C51624]">
          <HeartPulse className="size-6" />
        </div>
      </div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        className="grid gap-3 sm:grid-cols-2"
      >
        {fields.map((field, index) => (
          <motion.div
            key={field}
            variants={{
              hidden: { opacity: 0, x: -12 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.35 }}
            className={index === 2 || index === 3 ? "sm:col-span-1" : ""}
          >
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280]">
              {field}
            </label>
            <div className="flex h-12 items-center justify-between rounded-2xl border border-[#FAD7DD] bg-[#FFF8F9] px-4 text-sm font-semibold text-[#9CA3AF]">
              <span>Preview only</span>
              <span className="size-2 rounded-full bg-[#F43F4E]/45" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Card>
  );
}

function RiskResultCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 24 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="relative overflow-hidden p-6">
        <div
          className="absolute -right-14 -top-12 size-44 rounded-[4rem] bg-[#FAD7DD]/65"
          aria-hidden="true"
        />
        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#C51624]">
                Sample Result
              </p>
              <h3 className="mt-2 font-heading text-3xl font-bold text-[#111418]">
                Moderate Risk
              </h3>
            </div>
            <div className="flex size-14 items-center justify-center rounded-3xl bg-[#F59E0B]/12 text-[#F59E0B]">
              <CircleGauge className="size-7" />
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] bg-[#FFF8F9] p-5">
            <div className="mb-3 flex items-center justify-between text-sm font-semibold">
              <span className="text-[#374151]">Screening overview</span>
              <span className="text-[#C51624]">64%</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-[#FAD7DD]">
              <motion.div
                initial={{ width: "0%" }}
                whileInView={{ width: "64%" }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="h-full rounded-full bg-[linear-gradient(90deg,#F59E0B,#F43F4E)]"
              />
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {[
              { icon: Activity, text: "Physical activity may affect risk" },
              { icon: ShieldCheck, text: "Family history can be relevant" },
              { icon: AlertCircle, text: "Blood pressure deserves attention" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.text}
                  className="flex items-center gap-3 rounded-2xl border border-[#FAD7DD]/75 bg-white px-4 py-3 text-sm font-semibold text-[#374151]"
                >
                  <Icon className="size-4 text-[#C51624]" />
                  {item.text}
                </div>
              );
            })}
          </div>

          <p className="mt-5 rounded-2xl bg-[#35B8E5]/10 p-4 text-sm leading-6 text-[#374151]">
            Your result may be influenced by blood pressure, activity level,
            and family history.
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

export function ScreeningPreviewSection() {
  return (
    <section id="screening" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
        >
          <SectionHeading
            eyebrow="Screening preview"
            title="Start With Simple Health Information"
            subtitle="CardioSense uses common health indicators to provide an early screening overview."
          />
        </motion.div>

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <MockHealthForm />
          <RiskResultCard />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45 }}
          className="mt-7 flex items-start gap-3 rounded-3xl border border-[#FAD7DD]/80 bg-[#FFF1F3] p-4 text-sm leading-6 text-[#6B7280]"
        >
          <Info className="mt-0.5 size-5 shrink-0 text-[#C51624]" />
          <p>
            CardioSense is not a diagnostic tool. Screening results should be
            discussed with a qualified healthcare professional.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
