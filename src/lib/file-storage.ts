type FileMapping = {
  customUrl: string
  blobUrl: string
  filename: string
  uploadedAt: string
}

const fileStore: Record<string, FileMapping> = {}

export function generateCustomUrl(filename: string): string {
  const timestamp = Date.now().toString(36)
  const cleanName = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
  return `${timestamp}_${cleanName}`
}

export function storeFileMapping(customId: string, blobUrl: string, filename: string): string {
  const customUrl = `/api/download/${customId}`
  fileStore[customId] = {
    customUrl,
    blobUrl,
    filename,
    uploadedAt: new Date().toISOString()
  }
  return customUrl
}

export function getFileMapping(customId: string): FileMapping | null {
  return fileStore[customId] || null
}
