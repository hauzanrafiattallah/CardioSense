"use client";

import { motion } from "framer-motion";
import {
  Apple,
  CigaretteOff,
  Dumbbell,
  Moon,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";

const habits = [
  {
    icon: Apple,
    text: "Eat balanced meals with vegetables, fruits, fiber, and lean protein",
  },
  {
    icon: ShieldCheck,
    text: "Reduce excessive salt, sugar, and saturated fat",
  },
  {
    icon: Dumbbell,
    text: "Stay physically active",
    cyan: true,
  },
  {
    icon: CigaretteOff,
    text: "Avoid smoking",
  },
  {
    icon: Sparkles,
    text: "Manage stress",
    cyan: true,
  },
  {
    icon: Moon,
    text: "Sleep regularly",
  },
  {
    icon: Stethoscope,
    text: "Check blood pressure and cholesterol periodically",
  },
  {
    icon: ShieldCheck,
    text: "Consult healthcare professionals when risk factors are present",
    cyan: true,
  },
];

export function PreventionSection() {
  return (
    <section id="prevention" className="relative overflow-hidden py-20 sm:py-24">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#FFF1F3_0%,#FFFFFF_42%,#FAD7DD_100%)]" />
      <div
        className="absolute inset-x-0 bottom-0 h-32 bg-white/50"
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
            eyebrow="Prevention guide"
            title="Build Habits That Protect Your Heart"
            subtitle="Small daily decisions can support long-term cardiovascular health and make prevention feel practical."
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07 } },
          }}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {habits.map((habit) => {
            const Icon = habit.icon;
            return (
              <motion.div
                key={habit.text}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.45 }}
                whileHover={{ y: -6 }}
                className="group"
              >
                <div className="flex h-full items-start gap-4 rounded-3xl border border-white/80 bg-white/84 p-5 shadow-[0_18px_50px_rgba(197,22,36,0.08)] backdrop-blur-md">
                  <motion.div
                    whileHover={{ y: -3, scale: 1.05 }}
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-2xl",
                      habit.cyan
                        ? "bg-[#35B8E5]/12 text-[#35B8E5]"
                        : "bg-[#FFF1F3] text-[#C51624]",
                    )}
                  >
                    <Icon className="size-6" />
                  </motion.div>
                  <p className="leading-7 text-[#374151]">{habit.text}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
