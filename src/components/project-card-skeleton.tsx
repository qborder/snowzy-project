"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function ProjectCardSkeleton({ reduce }: { reduce?: boolean }) {
  const padding = reduce ? "p-4 space-y-3" : "p-6 space-y-4"
  
  return (
    <div className="group overflow-hidden rounded-xl border border-white/10 bg-background/60 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-background/80">
      {/* Image placeholder with gradient background */}
      <div className="relative bg-gradient-to-br from-muted/60 via-muted/40 to-muted/20">
        <Skeleton className="aspect-video bg-gradient-to-r from-muted/60 via-muted/80 to-muted/60" />
        {/* Overlay elements to simulate image content */}
        <div className="absolute top-3 right-3">
          <Skeleton className="h-6 w-6 rounded-full bg-white/10" />
        </div>
        <div className="absolute bottom-3 left-3">
          <Skeleton className="h-3 w-16 rounded-full bg-white/20" />
        </div>
      </div>
      
      <div className={padding}>
        {/* Category badge */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
        
        {/* Title - varying widths for realism */}
        <Skeleton className="h-6 w-4/5 rounded" />
        <Skeleton className="h-6 w-2/3 rounded" />
        
        {/* Description lines */}
        <div className="space-y-2 pt-1">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
        
        {/* Tags */}
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-18 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2 pt-3">
          <Skeleton className="h-9 flex-1 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
        
        {/* Stats section */}
        <div className="flex justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-8 rounded" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-8 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
