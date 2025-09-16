"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function MarkdownEditorSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-background/60 backdrop-blur-md overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Tab buttons */}
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-12 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            {/* Action buttons */}
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
        
        {/* Format toolbar */}
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-white/5">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-7 rounded" />
          ))}
          <div className="w-px h-4 bg-white/10 mx-2" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-7 rounded" />
          ))}
        </div>
      </div>
      
      {/* Editor content area */}
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-white/10">
          {/* Editor pane */}
          <div className="p-6 space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
            </div>
            
            {/* Simulated markdown content */}
            <Skeleton className="h-6 w-32 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-4 w-4/5 rounded" />
            </div>
            
            <div className="pt-4">
              <Skeleton className="h-5 w-28 rounded" />
              <div className="space-y-2 mt-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-3/4 rounded" />
              </div>
            </div>
            
            <div className="pt-4">
              <Skeleton className="h-5 w-24 rounded" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
            </div>
            
            {/* Code block simulation */}
            <div className="pt-4">
              <div className="rounded-lg border border-white/10 bg-black/20 p-4 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded bg-white/10" />
                <Skeleton className="h-4 w-1/2 rounded bg-white/10" />
                <Skeleton className="h-4 w-5/6 rounded bg-white/10" />
              </div>
            </div>
          </div>
          
          {/* Preview pane */}
          <div className="p-6 space-y-4 bg-background/30">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
            
            {/* Rendered content simulation */}
            <Skeleton className="h-8 w-48 rounded" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-11/12 rounded" />
              <Skeleton className="h-4 w-10/12 rounded" />
            </div>
            
            <Skeleton className="h-6 w-36 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-4/5 rounded" />
            </div>
            
            {/* Simulated rendered code block */}
            <div className="rounded-lg border border-white/10 bg-black/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-3 w-12 rounded bg-white/20" />
                <Skeleton className="h-3 w-3 rounded-full bg-red-400/40" />
                <Skeleton className="h-3 w-3 rounded-full bg-yellow-400/40" />
                <Skeleton className="h-3 w-3 rounded-full bg-green-400/40" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-2/3 rounded bg-white/15" />
                <Skeleton className="h-3 w-1/2 rounded bg-white/15" />
                <Skeleton className="h-3 w-3/4 rounded bg-white/15" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Status bar */}
        <div className="border-t border-white/10 p-3 bg-background/40">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Skeleton className="h-3 w-12 rounded" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-3 w-3 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
