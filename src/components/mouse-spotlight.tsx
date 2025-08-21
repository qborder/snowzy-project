"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function MouseSpotlight() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [velocity, setVelocity] = useState({ x: 0, y: 0 })
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let animationFrame: number
    
    const updateMousePosition = (e: MouseEvent) => {
      const newX = e.clientX
      const newY = e.clientY
      
      // Calculate velocity for dynamic effects
      const vx = newX - lastPosition.x
      const vy = newY - lastPosition.y
      setVelocity({ x: vx, y: vy })
      setLastPosition({ x: newX, y: newY })
      
      // Smooth animation frame update
      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(() => {
        setMousePosition({ x: newX, y: newY })
      })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    window.addEventListener("mousemove", updateMousePosition)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
      document.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationFrame)
    }
  }, [lastPosition])

  const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y)
  const dynamicSize = Math.min(600, Math.max(300, 400 + speed * 2))
  const dynamicOpacity = Math.min(0.15, Math.max(0.03, 0.08 + speed * 0.001))

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30"
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Main spotlight with velocity-based sizing */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          left: mousePosition.x - dynamicSize / 2,
          top: mousePosition.y - dynamicSize / 2,
          width: dynamicSize,
          height: dynamicSize,
          background: `radial-gradient(circle, rgba(59, 130, 246, ${dynamicOpacity}) 0%, rgba(147, 51, 234, ${dynamicOpacity * 0.7}) 30%, transparent 70%)`,
        }}
        animate={{
          scale: [0.9, 1.1, 0.9],
          rotate: [0, 180, 360],
        }}
        transition={{
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" }
        }}
      />
      
      {/* Secondary glow layer */}
      <motion.div
        className="absolute rounded-full blur-2xl"
        style={{
          left: mousePosition.x - 250,
          top: mousePosition.y - 250,
          width: 500,
          height: 500,
          background: `radial-gradient(circle, rgba(168, 85, 247, ${dynamicOpacity * 0.4}) 0%, rgba(59, 130, 246, ${dynamicOpacity * 0.3}) 40%, transparent 70%)`,
        }}
        animate={{
          scale: [1.1, 0.8, 1.1],
          rotate: [360, 0],
        }}
        transition={{
          scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 15, repeat: Infinity, ease: "linear" }
        }}
      />
      
      {/* Inner bright core */}
      <motion.div
        className="absolute rounded-full blur-xl"
        style={{
          left: mousePosition.x - 100,
          top: mousePosition.y - 100,
          width: 200,
          height: 200,
          background: `radial-gradient(circle, rgba(255, 255, 255, ${Math.min(0.1, dynamicOpacity * 1.5)}) 0%, rgba(59, 130, 246, ${dynamicOpacity * 0.8}) 50%, transparent 80%)`,
        }}
        animate={{
          scale: [0.8, 1.3, 0.8],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Trailing particles effect */}
      {speed > 5 && (
        <motion.div
          className="absolute rounded-full blur-sm"
          style={{
            left: mousePosition.x - velocity.x * 2 - 15,
            top: mousePosition.y - velocity.y * 2 - 15,
            width: 30,
            height: 30,
            background: `radial-gradient(circle, rgba(59, 130, 246, ${Math.min(0.3, speed * 0.01)}) 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 0],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut"
          }}
        />
      )}
    </motion.div>
  )
}

export default MouseSpotlight
