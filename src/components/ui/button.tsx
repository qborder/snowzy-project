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
          "border border-destructive/20 bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:border-destructive/30",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-input/60",
        secondary:
          "border border-secondary/20 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:border-secondary/30",
        ghost: "border border-transparent hover:bg-accent hover:text-accent-foreground hover:border-accent/20",
        link: "border border-transparent text-primary underline-offset-4 hover:underline",
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
