"use client";

import { motion } from "framer-motion";

import { MotionCard } from "@/components/shared/MotionCard";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Card } from "@/components/ui/card";
import { problemCards, problemContent } from "@/features/home/data/HomeData";

export function Problem() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
        >
          <SectionTitle
            eyebrow={problemContent.eyebrow}
            title={problemContent.title}
            subtitle={problemContent.subtitle}
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
          {problemCards.map((card) => {
            const Icon = card.icon;

            return (
              <MotionCard
                key={card.title}
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  visible: { opacity: 1, y: 0 },
                }}
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
              </MotionCard>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
