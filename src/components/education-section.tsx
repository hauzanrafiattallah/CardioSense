"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Brain,
  HeartCrack,
  HeartPulse,
  Waves,
} from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";

const topics = [
  {
    icon: HeartPulse,
    title: "Coronary Heart Disease",
    text: "A condition related to reduced blood flow to the heart, often associated with narrowed arteries.",
  },
  {
    icon: Waves,
    title: "Hypertension",
    text: "High blood pressure can increase the workload of the heart and raise cardiovascular risk.",
  },
  {
    icon: Brain,
    title: "Stroke",
    text: "A serious condition related to disrupted blood flow to the brain, often connected to vascular health.",
  },
  {
    icon: HeartCrack,
    title: "Heart Failure",
    text: "A condition where the heart cannot pump blood as effectively as the body needs.",
  },
];

export function EducationSection() {
  return (
    <section id="education" className="bg-[#FFF8F9] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
        >
          <SectionHeading
            eyebrow="Education"
            title="Learn About Cardiovascular Health"
            subtitle="Understanding common cardiovascular conditions can help users recognize risk and make better health decisions."
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
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {topics.map((topic, index) => {
            const Icon = topic.icon;
            return (
              <motion.div
                key={topic.title}
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -8 }}
              >
                <Card className="group h-full p-6">
                  <div
                    className={
                      index === 2
                        ? "mb-6 flex size-14 items-center justify-center rounded-3xl bg-[#35B8E5]/12 text-[#35B8E5]"
                        : "mb-6 flex size-14 items-center justify-center rounded-3xl bg-[#FFF1F3] text-[#C51624]"
                    }
                  >
                    <Icon className="size-7" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-[#111418]">
                    {topic.title}
                  </h3>
                  <p className="mt-4 min-h-28 leading-7 text-[#6B7280]">
                    {topic.text}
                  </p>
                  <a
                    href="#education"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#C51624] transition-colors hover:text-[#F43F4E]"
                  >
                    Learn more
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
