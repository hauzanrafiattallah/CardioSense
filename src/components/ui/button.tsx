import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/Utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F43F4E]/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#C51624] text-white shadow-[0_18px_38px_rgba(197,22,36,0.22)] hover:-translate-y-0.5 hover:bg-[#F43F4E] hover:shadow-[0_22px_44px_rgba(244,63,78,0.28)]",
        secondary:
          "border border-[#FAD7DD] bg-white text-[#111418] shadow-[0_14px_34px_rgba(197,22,36,0.08)] hover:-translate-y-0.5 hover:border-[#F43F4E]/35 hover:bg-[#FFF1F3]",
        ghost:
          "text-[#111418] hover:bg-[#FFF1F3] hover:text-[#C51624]",
        light:
          "bg-white text-[#C51624] shadow-[0_18px_38px_rgba(17,20,24,0.13)] hover:-translate-y-0.5 hover:bg-[#FFF1F3]",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 px-4 text-xs",
        lg: "h-14 px-7 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
