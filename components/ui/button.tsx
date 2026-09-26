"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Printed buttons: square corners, a hard ink border and a hard offset
 * shadow with no blur — a sticker pressed onto the page. Pressing it pushes
 * the sticker down into its own shadow.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap border-[1.5px] border-[var(--ink)] font-mono font-semibold uppercase tracking-[0.13em] transition-[transform,box-shadow,background-color,color] duration-150 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--spot)] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_var(--ink)] active:translate-x-0 active:translate-y-0 active:shadow-none",
  {
    variants: {
      variant: {
        primary: "bg-[var(--spot)] text-white shadow-[3px_3px_0_var(--ink)]",
        ink: "bg-[var(--ink)] text-[var(--paper)] shadow-[3px_3px_0_var(--spot)]",
        blue: "bg-[var(--spot-2)] text-white shadow-[3px_3px_0_var(--ink)]",
        outline: "bg-transparent text-[var(--ink)] shadow-[3px_3px_0_var(--ink)]",
        ghost:
          "border-transparent bg-transparent text-[var(--ink-soft)] shadow-none hover:translate-x-0 hover:translate-y-0 hover:bg-[var(--paper-2)] hover:text-[var(--ink)] hover:shadow-none",
      },
      size: {
        sm: "h-9 px-3.5 text-[0.68rem]",
        md: "h-11 px-5 text-[0.74rem]",
        lg: "h-14 px-8 text-[0.82rem]",
        icon: "h-10 w-10 px-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          <span>Printing…</span>
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { buttonVariants };
