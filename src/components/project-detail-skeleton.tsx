"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function ProjectDetailSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl py-8">
      {/* Back button */}
      <div className="mb-6">
        <Skeleton className="h-9 w-32 rounded-md mb-4" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header section */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                {/* Title */}
                <Skeleton className="h-10 w-4/5 rounded mb-2" />
                <Skeleton className="h-10 w-2/3 rounded mb-4" />
                
                {/* Category and date */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-3 w-3 rounded" />
                    <Skeleton className="h-4 w-24 rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
              <Skeleton className="h-6 w-18 rounded-full" />
            </div>
          </div>

          {/* Video/Image placeholder */}
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-5 w-24 rounded" />
              </div>
              <div className="relative w-full bg-gradient-to-br from-muted/60 via-muted/40 to-muted/20 rounded-lg overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                <Skeleton className="absolute inset-0 bg-gradient-to-r from-muted/60 via-muted/80 to-muted/60" />
                {/* Play button simulation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Skeleton className="h-16 w-16 rounded-full bg-white/20" />
                </div>
              </div>
            </div>
          </div>

          {/* About section */}
          <div className="rounded-xl border border-white/10 bg-background/60 backdrop-blur-md">
            <div className="p-6">
              <Skeleton className="h-6 w-40 rounded mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-11/12 rounded" />
                <Skeleton className="h-4 w-10/12 rounded" />
                <Skeleton className="h-4 w-9/12 rounded" />
                <Skeleton className="h-4 w-8/12 rounded" />
              </div>
            </div>
          </div>

          {/* Screenshots section */}
          <div className="rounded-xl border border-white/10 bg-background/60 backdrop-blur-md">
            <div className="p-6">
              <Skeleton className="h-6 w-28 rounded mb-4" />
              <Skeleton className="w-full aspect-video rounded-lg bg-gradient-to-r from-muted/60 via-muted/80 to-muted/60" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 rounded-xl border border-white/10 bg-background/60 backdrop-blur-md">
            <div className="p-6">
              <Skeleton className="h-6 w-32 rounded mb-2" />
              <Skeleton className="h-4 w-40 rounded mb-6" />
              
              {/* Action buttons */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 rounded-md border border-white/10">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-20 rounded" />
                </div>
                <div className="flex items-center gap-2 p-3 rounded-md border border-white/10">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-18 rounded" />
                </div>
                <div className="flex items-center gap-2 p-3 rounded-md border border-white/10">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
                <div className="flex items-center gap-2 p-3 rounded-md border border-white/10">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-28 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
