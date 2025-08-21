"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Code2, GamepadIcon, Download } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <div className="flex flex-col items-center gap-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Build projects you’re proud of with {" "}
          <span className="text-primary">Snowzy</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.35, delay: 0.05, ease: [0.2, 0.8, 0.2, 1] }}
          className="max-w-prose leading-normal text-muted-foreground sm:text-xl sm:leading-8"
        >
          Practical tutorials, real project files, and clear guidance — focused on Roblox
          and modern web dev. Learn by building, step by step.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.3, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
          className="space-x-4"
        >
          <Button size="lg" asChild>
            <Link href="/projects">
              Browse projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="https://youtube.com/@snowzy" target="_blank">
              Watch tutorials
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export function FeaturesSection() {
  const features = [
    {
      icon: <GamepadIcon className="h-10 w-10" />,
      title: "Roblox Development",
      description: "Hands‑on scripting, core mechanics, and clean UI work in Roblox Studio.",
    },
    {
      icon: <Code2 className="h-10 w-10" />,
      title: "Web Development",
      description: "Build modern apps with React and Next.js — explained simply, no fluff.",
    },
    {
      icon: <Download className="h-10 w-10" />,
      title: "Project Downloads",
      description: "Grab the full code and assets so you can tweak and ship fast.",
    },
  ]

  return (
    <section className="relative space-y-6 py-8 md:py-12 lg:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(800px_500px_at_15%_0%,hsl(var(--primary)/0.10),transparent_60%),radial-gradient(700px_450px_at_85%_10%,hsl(var(--primary)/0.08),transparent_55%)]" />
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Features
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Everything you need to learn and build amazing projects.
        </p>
      </div>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <Card className="relative overflow-hidden border-white/10 bg-background/60 backdrop-blur-md">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  {feature.icon}
                  <CardTitle>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
