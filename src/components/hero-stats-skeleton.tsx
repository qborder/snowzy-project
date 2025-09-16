"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { FolderOpen, Download, Heart } from "lucide-react"

export function HeroStatsSkeleton() {
  const icons = [FolderOpen, Download, Heart]
  const labels = ["Projects", "Downloads", "Favorites"]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {icons.map((Icon, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-background/60 backdrop-blur-xl p-6 transition-all duration-300 hover:border-white/20"
        >
          <div className="flex items-center space-x-4">
            {/* Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 border border-primary/20">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            
            <div className="flex-1 space-y-2">
              {/* Label */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  {labels[index]}
                </span>
                <Skeleton className="h-3 w-8 rounded-full" />
              </div>
              
              {/* Value skeleton - different widths for variety */}
              <div className="flex items-baseline space-x-2">
                <Skeleton 
                  className={`h-8 rounded ${
                    index === 0 ? 'w-12' : 
                    index === 1 ? 'w-20' : 
                    'w-8'
                  }`} 
                />
                {index === 1 && <Skeleton className="h-4 w-6 rounded" />}
              </div>
            </div>
          </div>
          
          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      ))}
    </div>
  )
}
