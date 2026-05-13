"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BookOpen,
  HeartPulse,
  Sparkles,
} from "lucide-react";

import { RiskBadge } from "@/components/shared/RiskBadge";
import { Button } from "@/components/ui/button";
import { heroBadges, heroContent, heroMetrics } from "@/features/home/data/HomeData";
import { cn } from "@/lib/Utils";

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 },
};

function AnimatedEcgLine() {
  return (
    <svg
      viewBox="0 0 430 96"
      className="h-20 w-full"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 55 H84 L103 55 L121 25 L146 79 L172 55 H222 L242 55 L260 38 L285 66 L307 55 H420"
        stroke="#FAD7DD"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        d="M10 55 H84 L103 55 L121 25 L146 79 L172 55 H222 L242 55 L260 38 L285 66 L307 55 H420"
        stroke="#C51624"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.45, delay: 0.55, ease: "easeInOut" }}
      />
      <path
        d="M10 55 H84 L103 55 L121 25 L146 79 L172 55 H222 L242 55 L260 38 L285 66 L307 55 H420"
        stroke="#35B8E5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ecg-dash opacity-70"
      />
    </svg>
  );
}

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto mt-12 w-full min-w-0 max-w-[calc(100vw-2rem)] sm:max-w-[560px] lg:mt-0"
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative min-h-[430px] overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 p-4 shadow-[0_34px_90px_rgba(197,22,36,0.16)] backdrop-blur-xl sm:min-h-[470px] sm:p-8"
      >
        <div
          className="absolute inset-x-8 top-8 h-[310px] rounded-[42%_58%_49%_51%/47%_39%_61%_53%] bg-[linear-gradient(145deg,#FAD7DD_0%,#FFF1F3_47%,#F43F4E_100%)] opacity-80"
          aria-hidden="true"
        />
        <div
          className="absolute right-10 top-10 h-20 w-20 rotate-12 rounded-[2rem] border border-white/70 bg-white/45"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-20 right-12 h-16 w-28 -rotate-6 rounded-[2rem] border border-[#35B8E5]/25 bg-[#35B8E5]/10"
          aria-hidden="true"
        />

        <div className="relative flex min-h-[392px] flex-col items-center justify-center sm:min-h-[410px]">
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="relative flex size-44 items-center justify-center rounded-[3rem] bg-white shadow-[0_24px_55px_rgba(197,22,36,0.18)] sm:size-52"
          >
            <div className="absolute inset-4 rounded-[2.5rem] bg-[#FFF1F3]" />
            <HeartPulse className="relative size-24 text-[#C51624] sm:size-28" />
            <span className="absolute -right-4 top-6 flex size-12 items-center justify-center rounded-2xl bg-[#35B8E5] text-white shadow-[0_16px_34px_rgba(53,184,229,0.28)]">
              <Sparkles className="size-6" />
            </span>
          </motion.div>

          <div className="mt-8 w-full rounded-[2rem] border border-white/80 bg-white/84 p-4 shadow-[0_18px_44px_rgba(197,22,36,0.08)] backdrop-blur-md">
            <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-[#C51624]">
              <span>{heroContent.visualLabel}</span>
              <span className="rounded-full bg-[#22C55E]/10 px-2 py-1 text-[#22C55E]">
                {heroContent.visualStatus}
              </span>
            </div>
            <AnimatedEcgLine />
          </div>
        </div>
      </motion.div>

      {heroMetrics.map((card) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 + card.delay }}
            className={cn(
              "absolute w-[148px] rounded-3xl border border-white/80 bg-white/88 p-3 shadow-[0_18px_50px_rgba(197,22,36,0.13)] backdrop-blur-xl sm:w-[172px] sm:p-4",
              card.className,
            )}
          >
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{
                duration: 3.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: card.delay,
              }}
            >
              <div className="mb-3 flex size-10 items-center justify-center rounded-2xl bg-[#FFF1F3] text-[#C51624]">
                <Icon className="size-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6B7280]">
                {card.title}
              </p>
              <p className="mt-1 font-heading text-base font-bold text-[#111418] sm:text-lg">
                {card.value}
              </p>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#FFF1F3_0%,#FFFFFF_58%,#FFF8F9_100%)] pt-32 pb-20 sm:pt-36 lg:pb-28"
    >
      <div
        className="absolute left-1/2 top-24 h-[520px] w-[920px] -translate-x-1/2 rounded-[45%_55%_60%_40%/40%_42%_58%_60%] bg-[#FAD7DD]/42 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
        <motion.div
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
          initial="hidden"
          animate="visible"
          className="min-w-0 max-w-3xl"
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.55 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FAD7DD] bg-white/76 px-4 py-2 text-sm font-bold text-[#C51624] shadow-[0_12px_34px_rgba(197,22,36,0.08)] backdrop-blur"
          >
            <Activity className="size-4 text-[#35B8E5]" />
            {heroContent.eyebrow}
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.62 }}
            className="text-balance font-heading text-4xl font-extrabold leading-[1.05] text-[#111418] sm:text-5xl lg:text-[64px]"
          >
            {heroContent.title}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.62 }}
            className="mt-6 max-w-2xl text-base leading-8 text-[#6B7280] sm:text-lg"
          >
            {heroContent.description}
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.62 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href="#screening">
                {heroContent.primaryCta}
                <ArrowRight />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <a href="#education">
                {heroContent.secondaryCta}
                <BookOpen />
              </a>
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.62 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            {heroBadges.map((badge) => (
              <RiskBadge key={badge.label} tone={badge.tone}>
                {badge.label}
              </RiskBadge>
            ))}
          </motion.div>
        </motion.div>

        <HeroVisual />
      </div>
    </section>
  );
}
