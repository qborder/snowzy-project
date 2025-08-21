"use client"

import { useScroll, useTransform, motion } from "framer-motion"
import { useRef } from "react"

interface ParallaxContainerProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export function ParallaxContainer({ children, speed = 0.5, className }: ParallaxContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4])

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y, opacity }}>
        {children}
      </motion.div>
    </div>
  )
}
