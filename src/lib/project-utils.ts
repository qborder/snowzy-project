export function generateProjectId(): string {
  return Math.floor(10000 + Math.random() * 90000).toString()
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function parseProjectUrl(id: string, slug: string) {
  return {
    id: id,
    slug: slug
  }
}
