"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, HeartPulse, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { navItems } from "@/features/home/data/NavData";
import { cn } from "@/lib/Utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-transparent transition-all duration-300",
        scrolled
          ? "border-[#FAD7DD]/80 bg-white/86 shadow-[0_14px_50px_rgba(197,22,36,0.09)] backdrop-blur-xl"
          : "bg-white/58 backdrop-blur-md",
      )}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#home"
          className="group flex items-center gap-3"
          aria-label="Beranda CardioSense"
          onClick={() => setIsOpen(false)}
        >
          <span className="flex size-11 items-center justify-center rounded-2xl bg-[#C51624] text-white shadow-[0_16px_34px_rgba(197,22,36,0.24)] transition-transform duration-300 group-hover:-translate-y-0.5">
            <HeartPulse className="size-6" />
          </span>
          <span className="font-heading text-xl font-bold text-[#111418]">
            CardioSense
          </span>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative text-sm font-semibold text-[#374151] transition-colors hover:text-[#C51624]"
            >
              {item.label}
              <span className="absolute -bottom-2 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-[#F43F4E] transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </div>

        <div className="hidden lg:block">
          <Button asChild>
            <a href="#screening">
              Mulai Skrining
              <ArrowRight />
            </a>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex size-11 cursor-pointer items-center justify-center rounded-2xl border border-[#FAD7DD] bg-white text-[#111418] shadow-[0_12px_30px_rgba(197,22,36,0.08)] transition-colors hover:text-[#C51624] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F43F4E]/40 lg:hidden"
          aria-label="Buka atau tutup menu navigasi"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="mx-4 mb-4 rounded-3xl border border-[#FAD7DD]/90 bg-white/96 p-3 shadow-[0_22px_50px_rgba(197,22,36,0.12)] backdrop-blur-xl lg:hidden"
          >
            <div className="grid gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#FFF1F3] hover:text-[#C51624]"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <Button asChild className="mt-3 w-full">
              <a href="#screening" onClick={() => setIsOpen(false)}>
                Mulai Skrining
                <ArrowRight />
              </a>
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
