import { kv } from '@vercel/kv'
import crypto from 'crypto'

type FileData = {
  id: string
  originalName: string
  displayName: string
  blobUrl: string
  mimeType?: string
  fileSize?: number
  uploadedAt: string
  contentHash: string
}

const localStore: Map<string, FileData> = new Map()
const localNameIndex: Map<string, string> = new Map()

const isVercelEnvironment = () => !!process.env.VERCEL || !!process.env.KV_REST_API_URL

function createBeautifulName(filename: string): string {
  const ext = filename.split('.').pop() || ''
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')
  const cleanName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  
  return ext ? `${cleanName}.${ext}` : cleanName
}

function generateUniqueId(): string {
  return crypto.randomBytes(8).toString('hex')
}

function generateContentHash(content: Buffer): string {
  return crypto.createHash('md5').update(content).digest('hex').slice(0, 8)
}

export async function storeFile(file: {
  filename: string
  blobUrl: string
  mimeType?: string
  fileSize?: number
  content?: Buffer
}): Promise<{ id: string; displayName: string; downloadUrl: string }> {
  const id = generateUniqueId()
  const displayName = createBeautifulName(file.filename)
  const contentHash = file.content ? generateContentHash(file.content) : crypto.randomBytes(4).toString('hex')
  
  console.log(`[Storage] Storing file: ${file.filename} -> ${displayName} (ID: ${id})`)
  
  const fileData: FileData = {
    id,
    originalName: file.filename,
    displayName,
    blobUrl: file.blobUrl,
    mimeType: file.mimeType,
    fileSize: file.fileSize,
    uploadedAt: new Date().toISOString(),
    contentHash
  }
  
  let kvSuccess = false
  
  if (isVercelEnvironment()) {
    try {
      console.log(`[Storage] Attempting KV storage for file: ${id}`)
      const kvResults = await Promise.allSettled([
        kv.hset(`file:${id}`, fileData),
        kv.set(`name:${displayName}`, id)
      ])
      
      const failedOps = kvResults.filter(r => r.status === 'rejected')
      if (failedOps.length > 0) {
        console.warn(`[Storage] ${failedOps.length} KV operations failed:`, failedOps)
        throw new Error('KV operations failed')
      }
      
      console.log(`[Storage] KV storage successful for file: ${id}`)
      kvSuccess = true
    } catch (error) {
      console.error(`[Storage] KV storage failed for file: ${id}`, error)
      console.log(`[Storage] Falling back to memory storage`)
    }
  }
  
  if (!kvSuccess) {
    localStore.set(id, fileData)
    localNameIndex.set(displayName, id)
    console.log(`[Storage] Memory storage successful for file: ${id}`)
  }
  
  return {
    id,
    displayName,
    downloadUrl: `/api/files/${displayName}`
  }
}

export async function getFileById(id: string): Promise<FileData | null> {
  if (isVercelEnvironment()) {
    try {
      return await kv.hgetall(`file:${id}`) as FileData | null
    } catch (error) {
      console.warn('KV storage failed, falling back to memory:', error)
    }
  }
  
  return localStore.get(id) || null
}

export async function getFileByName(displayName: string): Promise<FileData | null> {
  console.log(`[Storage] Looking up file by name: ${displayName}`)
  
  if (isVercelEnvironment()) {
    try {
      console.log(`[Storage] Using KV storage for lookup`)
      const id = await kv.get(`name:${displayName}`)
      console.log(`[Storage] KV lookup result for ${displayName}:`, id)
      
      if (id && typeof id === 'string') {
        const fileData = await getFileById(id)
        console.log(`[Storage] Found file data via KV:`, fileData ? 'Yes' : 'No')
        return fileData
      }
      
      // Fallback: try to find by scanning all files if direct lookup fails
      console.log(`[Storage] Direct KV lookup failed, scanning all files`)
      const keys = await kv.keys('file:*')
      for (const key of keys) {
        const fileId = key.replace('file:', '')
        const fileData = await getFileById(fileId)
        if (fileData && fileData.displayName === displayName) {
          console.log(`[Storage] Found file by scanning: ${fileId}`)
          // Repair the name index
          await kv.set(`name:${displayName}`, fileId)
          return fileData
        }
      }
    } catch (error) {
      console.warn('[Storage] KV storage failed, falling back to memory:', error)
    }
  }
  
  console.log(`[Storage] Using memory storage for lookup`)
  const id = localNameIndex.get(displayName)
  if (id) {
    const fileData = localStore.get(id) || null
    console.log(`[Storage] Memory lookup result:`, fileData ? 'Found' : 'Not found')
    return fileData
  }
  
  console.log(`[Storage] File not found anywhere: ${displayName}`)
  return null
}

export async function deleteFile(id: string): Promise<boolean> {
  const fileData = await getFileById(id)
  if (!fileData) return false
  
  if (isVercelEnvironment()) {
    try {
      await kv.del(`file:${id}`)
      await kv.del(`name:${fileData.displayName}`)
    } catch (error) {
      console.warn('KV storage failed, falling back to memory:', error)
    }
  }
  
  localStore.delete(id)
  localNameIndex.delete(fileData.displayName)
  
  return true
}

export async function listFiles(): Promise<FileData[]> {
  if (isVercelEnvironment()) {
    try {
      const keys = await kv.keys('file:*')
      const files = await Promise.all(
        keys.map(async (key) => {
          const id = key.replace('file:', '')
          return await getFileById(id)
        })
      )
      return files.filter(Boolean) as FileData[]
    } catch (error) {
      console.warn('KV storage failed, falling back to memory:', error)
    }
  }
  
  return Array.from(localStore.values())
}
