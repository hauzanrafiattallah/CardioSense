"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, HeartPulse, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { navItems } from "@/features/home/data/NavData";
import { cn } from "@/lib/Utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Floating Pill Navbar */}
      <motion.div
        initial={{ opacity: 0, y: -32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-5 z-50 flex justify-center px-4 pointer-events-none"
      >
        <motion.nav
          animate={
            scrolled
              ? {
                  boxShadow:
                    "0 16px 48px rgba(197,22,36,0.12), 0 4px 16px rgba(197,22,36,0.06)",
                }
              : {
                  boxShadow:
                    "0 8px 32px rgba(197,22,36,0.08), 0 2px 12px rgba(0,0,0,0.04)",
                }
          }
          transition={{ duration: 0.3 }}
          className={cn(
            "pointer-events-auto flex items-center gap-1.5 rounded-full px-4 py-2.5 transition-all duration-300",
            scrolled
              ? "border border-[#FAD7DD]/80 bg-white/94 backdrop-blur-2xl"
              : "border border-white/50 bg-white/18 backdrop-blur-xl",
          )}
        >
          {/* Logo */}
          <a
            href="#home"
            aria-label="Beranda CardioSense"
            onClick={() => setIsOpen(false)}
            className="group mr-2 flex items-center gap-3 rounded-full px-3 py-2 transition-all duration-200 hover:bg-white/10"
          >
            <motion.span
              whileHover={{ scale: 1.12, rotate: -8 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="flex size-10 items-center justify-center rounded-full bg-[#C51624] text-white shadow-[0_6px_20px_rgba(197,22,36,0.40)]"
            >
              <HeartPulse className="size-5" />
            </motion.span>
            <span className="font-heading text-base font-bold text-[#111418] transition-colors duration-200">
              CardioSense
            </span>
          </a>

          {/* Divider */}
          <div className="mr-2 h-6 w-px bg-[#C51624]/15 transition-colors duration-300" />

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                onClick={() => setActiveItem(item.href)}
                className={cn(
                  "relative rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-200",
                  "text-[#374151] hover:text-[#C51624]",
                  activeItem === item.href && "text-[#C51624]",
                )}
              >
                {/* Hover pill background */}
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.span
                      layoutId="nav-hover-pill"
                      initial={{ opacity: 0, scale: 0.88 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.88 }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 28,
                      }}
                      className="absolute inset-0 rounded-full bg-[#C51624]/8"
                    />
                  )}
                </AnimatePresence>
                <span className="relative z-10">{item.label}</span>
              </motion.a>
            ))}
          </div>

          {/* Divider */}
          <div className="ml-2 hidden h-6 w-px bg-[#C51624]/15 transition-colors duration-300 lg:block" />

          {/* CTA Button */}
          <motion.a
            href="#screening"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="ml-2 hidden items-center gap-2 rounded-full bg-[#C51624] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(197,22,36,0.35)] transition-all duration-200 hover:bg-[#a8111f] hover:shadow-[0_10px_28px_rgba(197,22,36,0.45)] lg:flex"
          >
            Skrining
            <ArrowRight className="size-4" />
          </motion.a>

          {/* Mobile Hamburger */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Buka atau tutup menu navigasi"
            aria-expanded={isOpen}
            className="ml-2 flex size-11 items-center justify-center rounded-full border border-[#FAD7DD] bg-white/80 text-[#111418] transition-colors duration-200 hover:border-[#C51624]/30 hover:text-[#C51624] lg:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <X className="size-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Menu className="size-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.nav>
      </motion.div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-22 z-40 overflow-hidden rounded-3xl border border-[#FAD7DD]/70 bg-white/96 shadow-[0_24px_64px_rgba(197,22,36,0.14)] backdrop-blur-2xl lg:hidden"
          >
            <div className="p-3">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.055, duration: 0.22 }}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center rounded-2xl px-4 py-3 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#FFF1F3] hover:text-[#C51624]"
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
            <div className="border-t border-[#FAD7DD]/50 p-3">
              <a
                href="#screening"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#C51624] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(197,22,36,0.32)] transition-all hover:bg-[#a8111f]"
              >
                Skrining Sekarang
                <ArrowRight className="size-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
