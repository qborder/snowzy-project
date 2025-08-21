'use client'

import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[radial-gradient(1200px_800px_at_20%_-10%,hsl(var(--primary)/0.10),transparent_60%),radial-gradient(1000px_700px_at_90%_10%,hsl(var(--primary)/0.06),transparent_55%)]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-background/40 px-8 py-6 backdrop-blur-md shadow-2xl"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-1 rounded-full border border-primary/20 border-b-primary/60"
          />
        </div>
        
        <div className="text-center space-y-1">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
          >
            Snowzy
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ delay: 0.3, duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-sm text-muted-foreground"
          >
            Loading...
          </motion.p>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
          className="h-0.5 w-32 bg-gradient-to-r from-transparent via-primary to-transparent origin-center"
        />
      </motion.div>
    </div>
  )
}
