"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowLeft, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(600px_400px_at_50%_50%,hsl(var(--primary)/0.08),transparent_70%)]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="w-full max-w-2xl mx-auto text-center"
      >
        <Card className="border-white/10 bg-background/60 backdrop-blur-2xl">
          <CardHeader className="pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
              className="mx-auto mb-6 h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <div className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                404
              </div>
            </motion.div>
            
            <CardTitle className="text-3xl md:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Page Not Found
              </span>
            </CardTitle>
            
            <CardDescription className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist or has been moved. Don&apos;t worry, it happens to the best of us.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5" asChild>
                <Link href="/projects">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Browse Projects
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="pt-4 border-t border-white/10"
            >
              <p className="text-sm text-muted-foreground mb-4">
                Looking for something specific? Try searching:
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <Button variant="ghost" size="sm" className="text-xs" asChild>
                  <Link href="/projects?cat=Roblox">
                    Roblox Projects
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="text-xs" asChild>
                  <Link href="/projects?cat=Web%20Development">
                    Web Development
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="text-xs" asChild>
                  <Link href="/">
                    Latest Updates
                  </Link>
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-8"
        >
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
