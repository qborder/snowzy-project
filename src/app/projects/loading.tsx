import { ProjectCardSkeleton } from "@/components/project-card-skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto pb-16 pt-8">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
