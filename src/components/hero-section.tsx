"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Code2, GamepadIcon, Download } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
          Build Amazing Projects with{" "}
          <span className="text-primary">Snowzy</span>
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Discover cutting-edge tutorials and download project files for Roblox development, 
          web applications, and modern programming techniques.
        </p>
        <div className="space-x-4">
          <Button size="lg" asChild>
            <Link href="/projects">
              View Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="https://youtube.com/@snowzy" target="_blank">
              Watch Tutorials
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export function FeaturesSection() {
  const features = [
    {
      icon: <GamepadIcon className="h-10 w-10" />,
      title: "Roblox Development",
      description: "Advanced scripting tutorials, game mechanics, and UI design for Roblox Studio.",
    },
    {
      icon: <Code2 className="h-10 w-10" />,
      title: "Web Development",
      description: "Modern web applications using React, Next.js, and cutting-edge technologies.",
    },
    {
      icon: <Download className="h-10 w-10" />,
      title: "Project Downloads",
      description: "Get complete source code and assets for all tutorial projects.",
    },
  ]

  return (
    <section className="container space-y-6 py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Features
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Everything you need to learn and build amazing projects.
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} className="relative overflow-hidden">
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
        ))}
      </div>
    </section>
  )
}
