export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[radial-gradient(1200px_800px_at_20%_-10%,hsl(var(--primary)/0.10),transparent_60%),radial-gradient(1000px_700px_at_90%_10%,hsl(var(--primary)/0.06),transparent_55%)]">
      <div className="relative flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-background/40 px-6 py-5 backdrop-blur-md">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary/60 border-t-transparent" />
        <span className="text-sm text-muted-foreground">Loading…</span>
      </div>
    </div>
  )
}
