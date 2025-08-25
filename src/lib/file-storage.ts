type FileMapping = {
  id: string
  customUrl: string
  blobUrl: string
  filename: string
  originalName: string
  slugifiedName: string
  fileSize?: number
  mimeType?: string
  contentHash?: string
  uploadedAt: string
}

type FileIndex = {
  [cleanName: string]: string
}

type HashIndex = {
  [hash: string]: string
}

const fileStore: Record<string, FileMapping> = {}
const nameIndex: FileIndex = {}
const hashIndex: HashIndex = {}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function generateReadableName(filename: string): string {
  const name = filename.replace(/\.[^/.]+$/, '')
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  
  const words = name.split(/[^a-zA-Z0-9]+/).filter(Boolean)
  const readableName = words.join('-')
  
  return `${readableName}.${ext}`
}

function generateFileHash(content: ArrayBuffer): string {
  const array = new Uint8Array(content)
  let hash = 0
  for (let i = 0; i < array.length; i++) {
    const char = array[i]
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

export function generateCustomUrl(filename: string): string {
  const name = filename.replace(/\.[^/.]+$/, '')
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const cleanName = slugify(name)
  
  let finalName = `${cleanName}.${ext}`
  let counter = 1
  
  while (nameIndex[finalName]) {
    finalName = `${cleanName}-${counter}.${ext}`
    counter++
  }
  
  return finalName
}

export function findDuplicateFile(
  contentHash: string,
  filename: string,
  fileSize: number,
  mimeType?: string
): FileMapping | null {
  const existingId = hashIndex[contentHash]
  if (!existingId) return null
  
  const existing = fileStore[existingId]
  if (!existing) return null
  
  const isSameFile = existing.fileSize === fileSize && 
                    existing.mimeType === mimeType && 
                    existing.originalName === filename
                    
  return isSameFile ? existing : null
}

export function storeFileMapping(
  filename: string,
  blobUrl: string,
  fileSize?: number,
  mimeType?: string,
  contentHash?: string
): { id: string, customUrl: string, isExisting?: boolean } {
  if (contentHash) {
    const duplicate = findDuplicateFile(contentHash, filename, fileSize || 0, mimeType)
    if (duplicate) {
      return { id: duplicate.id, customUrl: duplicate.customUrl, isExisting: true }
    }
  }
  
  const id = generateUniqueId()
  const slugifiedName = generateCustomUrl(filename)
  const customUrl = `/api/download/${slugifiedName}`
  
  const mapping: FileMapping = {
    id,
    customUrl,
    blobUrl,
    filename,
    originalName: filename,
    slugifiedName,
    fileSize,
    mimeType,
    contentHash,
    uploadedAt: new Date().toISOString()
  }
  
  fileStore[id] = mapping
  nameIndex[slugifiedName] = id
  if (contentHash) {
    hashIndex[contentHash] = id
  }
  
  return { id, customUrl }
}

export function getFileMapping(identifier: string): FileMapping | null {
  if (fileStore[identifier]) {
    return fileStore[identifier]
  }
  
  const id = nameIndex[identifier]
  if (id && fileStore[id]) {
    return fileStore[id]
  }
  
  return null
}
