import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:shadow-[0_0_0_6px_hsl(var(--ring)/0.18)] active:translate-y-[1px] active:scale-95 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border border-primary/20 bg-primary text-primary-foreground hover:bg-primary/90 hover:border-primary/30 hover:scale-105 hover:shadow-[0_8px_30px_rgb(0,122,255,0.3)]",
        destructive:
          "border border-red-600 bg-red-600 text-white hover:bg-red-700 hover:border-red-700 hover:scale-105 hover:shadow-[0_8px_30px_rgb(220,38,38,0.4)]",
        success:
          "border border-green-600 bg-green-600 text-white hover:bg-green-700 hover:border-green-700 hover:scale-105 hover:shadow-[0_8px_30px_rgb(34,197,94,0.4)]",
        warning:
          "border border-orange-500 bg-orange-500 text-white hover:bg-orange-600 hover:border-orange-600 hover:scale-105 hover:shadow-[0_8px_30px_rgb(249,115,22,0.4)]",
        info:
          "border border-blue-500 bg-blue-500 text-white hover:bg-blue-600 hover:border-blue-600 hover:scale-105 hover:shadow-[0_8px_30px_rgb(59,130,246,0.4)]",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-input/60",
        secondary:
          "border border-secondary/20 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:border-secondary/30",
        ghost: "border border-transparent hover:bg-accent hover:text-accent-foreground hover:border-accent/20",
        link: "border border-transparent text-primary underline-offset-4 hover:underline",
        gradient: "border border-transparent bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:scale-105 hover:shadow-[0_8px_30px_rgb(59,130,246,0.4)]",
        neon: "border border-cyan-400 bg-transparent text-cyan-400 hover:bg-cyan-400 hover:text-black hover:scale-105 hover:shadow-[0_0_30px_rgb(34,211,238,0.6)] transition-all duration-300",
        premium: "border border-amber-500/30 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-black font-semibold hover:from-amber-400 hover:via-yellow-400 hover:to-amber-400 hover:scale-105 hover:shadow-[0_8px_30px_rgb(245,158,11,0.5)]",
        dark: "border border-zinc-700 bg-zinc-800 text-zinc-100 hover:bg-zinc-700 hover:border-zinc-600 hover:scale-105 hover:shadow-[0_8px_30px_rgb(39,39,42,0.6)]",
        glass: "border border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/30 hover:scale-105 hover:shadow-[0_8px_30px_rgb(255,255,255,0.1)]",
        rainbow: "border border-transparent bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 text-white hover:scale-105 hover:shadow-[0_8px_30px_rgb(139,92,246,0.4)] bg-size-200 hover:bg-right transition-all duration-500",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
