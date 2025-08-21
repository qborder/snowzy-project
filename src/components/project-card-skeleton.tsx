"use client"

export function ProjectCardSkeleton({ reduce }: { reduce?: boolean }) {
  return (
    <div className="group overflow-hidden rounded-xl border border-white/10 bg-background/60 backdrop-blur-md">
      <div className="relative bg-muted/40">
        <div className="aspect-video animate-pulse bg-muted/60" />
      </div>
      <div className={reduce ? "p-4 space-y-3" : "p-6 space-y-4"}>
        <div className="h-4 w-24 animate-pulse rounded bg-muted/60" />
        <div className="h-6 w-3/4 animate-pulse rounded bg-muted/60" />
        <div className="h-4 w-full animate-pulse rounded bg-muted/50" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted/50" />
        <div className="flex gap-2 pt-1">
          <div className="h-6 w-16 animate-pulse rounded bg-muted/50" />
          <div className="h-6 w-12 animate-pulse rounded bg-muted/50" />
          <div className="h-6 w-20 animate-pulse rounded bg-muted/50" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-10 flex-1 animate-pulse rounded bg-muted/50" />
          <div className="h-10 flex-1 animate-pulse rounded bg-muted/50" />
        </div>
      </div>
    </div>
  )
}
