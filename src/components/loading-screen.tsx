'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'

const loadingStates = [
  'Initializing workspace...',
  'Loading components...',
  'Almost ready...'
]

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentStateIndex, setCurrentStateIndex] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  const smoothProgress = useCallback((targetProgress: number, speed = 0.5) => {
    const increment = Math.max(1, (targetProgress - progress) * speed)
    return Math.min(targetProgress, progress + increment)
  }, [progress])

  useEffect(() => {
    let progressInterval: NodeJS.Timeout
    let stateInterval: NodeJS.Timeout
    let timeoutId: NodeJS.Timeout

    const startLoading = () => {
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return prev
          }
          const increment = Math.random() * 12 + 3
          return Math.min(95, prev + increment)
        })
      }, 200)

      stateInterval = setInterval(() => {
        setCurrentStateIndex(prev => (prev + 1) % loadingStates.length)
      }, 600)
    }

    const handleLoad = () => {
      setProgress(100)
      setCurrentStateIndex(loadingStates.length - 1)
      clearInterval(progressInterval)
      clearInterval(stateInterval)
      
      timeoutId = setTimeout(() => {
        setIsExiting(true)
        setTimeout(() => setIsLoading(false), 400)
      }, 400)
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      startLoading()
      window.addEventListener('load', handleLoad)
    }

    return () => {
      clearInterval(progressInterval)
      clearInterval(stateInterval)
      clearTimeout(timeoutId)
      window.removeEventListener('load', handleLoad)
    }
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 0.95
          }}
          transition={{ 
            duration: 0.8, 
            ease: [0.4, 0, 0.2, 1]
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm"
        >

          <div className="relative">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative mb-8"
            >
              <div className="relative h-32 w-32 mx-auto">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 via-primary/10 to-transparent"
                />
                
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-3 rounded-full"
                  style={{
                    background: `conic-gradient(from 0deg, transparent, hsl(var(--primary)), transparent)`,
                  }}
                />
                
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-6 rounded-full border-2 border-primary/20 border-t-primary/60"
                />
                
                <motion.div
                  animate={{ 
                    scale: [0.8, 1.2, 0.8],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-10 rounded-full bg-gradient-to-br from-primary/40 to-primary/10"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center space-y-4"
            >
              <motion.h2
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/70 to-primary bg-[length:200%_100%] bg-clip-text text-transparent"
              >
                Snowzy
              </motion.h2>
              
              <motion.p
                key={currentStateIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="text-base text-muted-foreground font-medium"
              >
                {loadingStates[currentStateIndex]}
              </motion.p>

              <div className="relative w-16 h-16 mx-auto mb-6">
                {/* Outer ring */}
                <div className="absolute inset-0 border-4 border-transparent border-t-primary/60 rounded-full animate-spin">
                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full" />
                </div>
                
                {/* Middle ring */}
                <div className="absolute inset-2 border-2 border-transparent border-r-primary/40 rounded-full animate-spin-reverse">
                  <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-1 bg-primary/60 rounded-full" />
                </div>
                
                {/* Inner ring */}
                <div className="absolute inset-4 border-2 border-transparent border-b-primary/30 rounded-full animate-spin">
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary/40 rounded-full" />
                </div>
                
                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                </div>
              </div>

              <div className="w-64 mx-auto space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Loading</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary/60 via-primary to-primary/80 rounded-full"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 1.8, ease: [0.2, 0.8, 0.2, 1] }}
              className="mt-8 h-px w-80 bg-gradient-to-r from-transparent via-primary/50 to-transparent origin-center"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
