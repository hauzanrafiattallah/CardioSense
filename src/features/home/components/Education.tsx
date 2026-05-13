"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { MotionCard } from "@/components/shared/MotionCard";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Card } from "@/components/ui/card";
import {
  educationCards,
  educationContent,
  educationLinkLabel,
} from "@/features/home/data/HomeData";

export function Education() {
  return (
    <section id="education" className="bg-[#FFF8F9] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
        >
          <SectionTitle
            eyebrow={educationContent.eyebrow}
            title={educationContent.title}
            subtitle={educationContent.subtitle}
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
          {educationCards.map((topic, index) => {
            const Icon = topic.icon;

            return (
              <MotionCard
                key={topic.title}
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Card className="group flex h-full flex-col p-6">
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
                  <p className="mt-4 leading-7 text-[#6B7280]">
                    {topic.text}
                  </p>
                  <a
                    href="#education"
                    className="mt-auto pt-6 inline-flex items-center gap-2 text-sm font-bold text-[#C51624] transition-colors hover:text-[#F43F4E]"
                  >
                    {educationLinkLabel}
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </Card>
              </MotionCard>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
