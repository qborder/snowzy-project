"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = (resolvedTheme ?? theme) === "dark"

  function toggle() {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <Button aria-label="Toggle theme" variant="ghost" size="icon" onClick={toggle}>
      <div className="relative h-4 w-4">
        {!mounted ? (
          <div className="absolute inset-0 rounded-full bg-foreground/20" />
        ) : (
          <AnimatePresence initial={false} mode="wait">
            {isDark ? (
              <motion.div key="moon" initial={{ opacity: 0, rotate: -90, scale: 0.8 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 90, scale: 0.8 }} transition={{ duration: 0.2 }} className="absolute inset-0">
                <Moon className="h-4 w-4" />
              </motion.div>
            ) : (
              <motion.div key="sun" initial={{ opacity: 0, rotate: 90, scale: 0.8 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: -90, scale: 0.8 }} transition={{ duration: 0.2 }} className="absolute inset-0">
                <Sun className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </Button>
  )
}
