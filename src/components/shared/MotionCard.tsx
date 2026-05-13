"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/Utils";

type MotionCardProps = HTMLMotionProps<"div"> & {
  lift?: boolean;
};

export function MotionCard({
  className,
  lift = true,
  whileHover,
  transition,
  ...props
}: MotionCardProps) {
  return (
    <motion.div
      className={cn("h-full", className)}
      whileHover={whileHover ?? (lift ? { y: -8 } : undefined)}
      transition={transition ?? { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    />
  );
}
