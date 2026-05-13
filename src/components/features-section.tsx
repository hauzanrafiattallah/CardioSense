"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BookOpen,
  ClipboardCheck,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: ClipboardCheck,
    title: "Risk Screening",
    description: "Estimate cardiovascular risk based on simple health inputs.",
    className: "md:col-span-2 lg:row-span-2",
    highlight: true,
  },
  {
    icon: Activity,
    title: "Risk Factor Explanation",
    description:
      "Understand which health factors may contribute to your screening result.",
    className: "",
  },
  {
    icon: BookOpen,
    title: "Heart Health Education",
    description:
      "Learn about cardiovascular disease, hypertension, stroke, cholesterol, and lifestyle habits.",
    className: "",
  },
  {
    icon: HeartHandshake,
    title: "Prevention Guidance",
    description:
      "Receive general recommendations about healthier habits and when to seek professional care.",
    className: "md:col-span-2 lg:col-span-1",
  },
];

export function FeaturesSection() {
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
          <SectionHeading
            eyebrow="Product toolkit"
            title="What CardioSense Provides"
            subtitle="A friendly screening and learning flow designed around early awareness, plain-language explanations, and practical prevention."
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.22 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="mt-12 grid auto-rows-[minmax(220px,auto)] gap-5 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8 }}
                className={feature.className}
              >
                <Card
                  className={cn(
                    "relative h-full overflow-hidden p-7",
                    feature.highlight &&
                      "bg-[linear-gradient(145deg,#C51624_0%,#F43F4E_68%,#FAD7DD_100%)] text-white",
                  )}
                >
                  {feature.highlight ? (
                    <div
                      className="absolute right-8 top-8 size-40 rounded-[3.5rem] border border-white/30 bg-white/12"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div
                    className={cn(
                      "relative mb-6 flex size-14 items-center justify-center rounded-3xl",
                      feature.highlight
                        ? "bg-white text-[#C51624]"
                        : index === 2
                          ? "bg-[#35B8E5]/12 text-[#35B8E5]"
                          : "bg-[#FFF1F3] text-[#C51624]",
                    )}
                  >
                    <Icon className="size-7" />
                  </div>
                  <div className="relative">
                    <h3
                      className={cn(
                        "font-heading text-2xl font-bold",
                        feature.highlight ? "text-white" : "text-[#111418]",
                      )}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-4 max-w-md leading-7",
                        feature.highlight ? "text-white/82" : "text-[#6B7280]",
                      )}
                    >
                      {feature.description}
                    </p>
                    {feature.highlight ? (
                      <div className="mt-8 flex items-center gap-3 rounded-3xl bg-white/15 p-4 text-sm font-semibold text-white backdrop-blur">
                        <ShieldCheck className="size-5 text-white" />
                        Early indicator, not a diagnosis
                      </div>
                    ) : null}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
