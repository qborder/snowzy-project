"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ className, type, label, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)

    const handleFocus = () => setIsFocused(true)
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setHasValue(e.target.value.length > 0)
    }

    return (
      <div className="relative">
        <div className="relative">
          <input
            type={type}
            className={cn(
              "flex h-12 w-full rounded-lg border border-input bg-background/60 backdrop-blur px-4 py-3 text-sm transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              "focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20",
              className
            )}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          
          <motion.div
            initial={false}
            animate={{
              scale: isFocused ? 1.02 : 1,
              opacity: isFocused ? 1 : 0
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-none absolute -inset-0.5 rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 blur-sm"
          />

          <motion.div
            initial={false}
            animate={{
              scaleX: isFocused ? 1 : 0,
              opacity: isFocused ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent origin-center"
          />
        </div>
        
        {label && (
          <motion.label
            initial={false}
            animate={{
              y: isFocused || hasValue ? -32 : 0,
              scale: isFocused || hasValue ? 0.85 : 1,
              color: isFocused ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-4 top-3 text-sm font-medium pointer-events-none origin-left"
          >
            {label}
          </motion.label>
        )}
      </div>
    )
  }
)
EnhancedInput.displayName = "EnhancedInput"

export { EnhancedInput }
