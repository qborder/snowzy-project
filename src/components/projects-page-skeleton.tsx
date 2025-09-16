"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { ProjectCardSkeleton } from "@/components/project-card-skeleton"

export function ProjectsPageSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="relative pt-16 pb-12 md:pt-20 md:pb-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5" />
        
        <div className="relative">
          <div className="container mx-auto">
            {/* Header section */}
            <div className="mx-auto max-w-5xl text-center mb-8">
              {/* Badge and category indicators */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-7 w-24 rounded-full" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-7 w-28 rounded-full" />
                </div>
              </div>
              
              {/* Main title */}
              <div className="space-y-4 mb-8">
                <Skeleton className="h-12 w-4/5 rounded-2xl mx-auto" />
                <Skeleton className="h-12 w-3/4 rounded-2xl mx-auto" />
              </div>
              
              {/* Description */}
              <div className="space-y-3 mb-4">
                <Skeleton className="h-6 w-full rounded-xl mx-auto max-w-3xl" />
                <Skeleton className="h-6 w-5/6 rounded-xl mx-auto max-w-2xl" />
              </div>
              
              {/* Stats line */}
              <Skeleton className="h-4 w-64 rounded-xl mx-auto" />
            </div>
            
            {/* Filter and search section */}
            <div className="mb-8 space-y-6">
              {/* Search and filter controls */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <Skeleton className="h-12 w-full md:w-80 rounded-xl" />
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-24 rounded-lg" />
                  <Skeleton className="h-10 w-20 rounded-lg" />
                  <Skeleton className="h-10 w-16 rounded-lg" />
                </div>
              </div>
              
              {/* Category filters */}
              <div className="flex flex-wrap gap-2 justify-center">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-20 rounded-full" />
                ))}
              </div>
              
              {/* Sort and view options */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-9 w-32 rounded-lg" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <Skeleton className="h-9 w-9 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Projects grid */}
      <div className="container mx-auto pb-16">
        <div className="mx-auto grid justify-center gap-5 sm:grid-cols-2 md:max-w-[90rem] md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 15 }).map((_, i) => (
            <ProjectCardSkeleton key={i} reduce={i % 4 === 0} />
          ))}
        </div>
        
        {/* Load more button */}
        <div className="flex justify-center mt-12">
          <Skeleton className="h-12 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
