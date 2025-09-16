"use client"

import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
  shimmer?: boolean
}

function Skeleton({ className, shimmer = true, ...props }: SkeletonProps & any) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted/40",
        shimmer && "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
