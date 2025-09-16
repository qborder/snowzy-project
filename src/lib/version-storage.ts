import { kv } from '@vercel/kv'
import { ProjectVersion } from '@/types/project'
import crypto from 'crypto'

const localVersionStore: Map<string, ProjectVersion[]> = new Map()

const isVercelEnvironment = () => !!process.env.VERCEL || !!process.env.KV_REST_API_URL

function generateVersionId(): string {
  return crypto.randomBytes(8).toString('hex')
}

export async function createVersion(projectId: string, versionData: Omit<ProjectVersion, 'id' | 'projectId' | 'downloads' | 'createdAt'>): Promise<ProjectVersion> {
  const version: ProjectVersion = {
    id: generateVersionId(),
    projectId,
    ...versionData,
    downloads: 0,
    createdAt: new Date().toISOString()
  }

  console.log(`[VersionStorage] Creating version: ${version.tag} for project: ${projectId}`)

  let kvSuccess = false

  if (isVercelEnvironment()) {
    try {
      const existingVersions = await getVersionsByProjectId(projectId)
      const updatedVersions = [version, ...existingVersions]
      
      await kv.set(`versions:${projectId}`, updatedVersions)
      console.log(`[VersionStorage] KV storage successful for version: ${version.id}`)
      kvSuccess = true
    } catch (error) {
      console.error(`[VersionStorage] KV storage failed for version: ${version.id}`, error)
    }
  }

  if (!kvSuccess) {
    const existingVersions = localVersionStore.get(projectId) || []
    localVersionStore.set(projectId, [version, ...existingVersions])
    console.log(`[VersionStorage] Memory storage successful for version: ${version.id}`)
  }

  return version
}

export async function getVersionsByProjectId(projectId: string): Promise<ProjectVersion[]> {
  if (isVercelEnvironment()) {
    try {
      const versions = await kv.get(`versions:${projectId}`) as ProjectVersion[] | null
      return versions || []
    } catch (error) {
      console.warn('[VersionStorage] KV storage failed, falling back to memory:', error)
    }
  }

  return localVersionStore.get(projectId) || []
}

export async function getVersionById(projectId: string, versionId: string): Promise<ProjectVersion | null> {
  const versions = await getVersionsByProjectId(projectId)
  return versions.find(v => v.id === versionId) || null
}

export async function updateVersionDownloads(projectId: string, versionId: string): Promise<ProjectVersion | null> {
  const versions = await getVersionsByProjectId(projectId)
  const versionIndex = versions.findIndex(v => v.id === versionId)
  
  if (versionIndex === -1) return null

  versions[versionIndex].downloads += 1
  const updatedVersion = versions[versionIndex]

  let kvSuccess = false

  if (isVercelEnvironment()) {
    try {
      await kv.set(`versions:${projectId}`, versions)
      kvSuccess = true
    } catch (error) {
      console.error('[VersionStorage] Failed to update version downloads in KV:', error)
    }
  }

  if (!kvSuccess) {
    localVersionStore.set(projectId, versions)
  }

  return updatedVersion
}

export async function updateVersion(projectId: string, versionId: string, versionData: Partial<Omit<ProjectVersion, 'id' | 'projectId' | 'createdAt'>>): Promise<ProjectVersion | null> {
  const versions = await getVersionsByProjectId(projectId)
  const versionIndex = versions.findIndex(v => v.id === versionId)
  
  if (versionIndex === -1) return null

  const updatedVersion = {
    ...versions[versionIndex],
    ...versionData,
    id: versionId,
    projectId,
    createdAt: versions[versionIndex].createdAt
  }

  versions[versionIndex] = updatedVersion

  let kvSuccess = false

  if (isVercelEnvironment()) {
    try {
      await kv.set(`versions:${projectId}`, versions)
      kvSuccess = true
    } catch (error) {
      console.error('[VersionStorage] Failed to update version in KV:', error)
    }
  }

  if (!kvSuccess) {
    localVersionStore.set(projectId, versions)
  }

  return updatedVersion
}

export async function deleteVersion(projectId: string, versionId: string): Promise<boolean> {
  const versions = await getVersionsByProjectId(projectId)
  const filteredVersions = versions.filter(v => v.id !== versionId)
  
  if (filteredVersions.length === versions.length) return false // Version not found

  let kvSuccess = false

  if (isVercelEnvironment()) {
    try {
      await kv.set(`versions:${projectId}`, filteredVersions)
      kvSuccess = true
    } catch (error) {
      console.error('[VersionStorage] Failed to delete version from KV:', error)
    }
  }

  if (!kvSuccess) {
    localVersionStore.set(projectId, filteredVersions)
  }

  return true
}

export async function getAllVersions(): Promise<{ [projectId: string]: ProjectVersion[] }> {
  if (isVercelEnvironment()) {
    try {
      const keys = await kv.keys('versions:*')
      const result: { [projectId: string]: ProjectVersion[] } = {}
      
      for (const key of keys) {
        const projectId = key.replace('versions:', '')
        const versions = await kv.get(key) as ProjectVersion[] | null
        if (versions) {
          result[projectId] = versions
        }
      }
      
      return result
    } catch (error) {
      console.warn('[VersionStorage] KV storage failed, falling back to memory:', error)
    }
  }

  const result: { [projectId: string]: ProjectVersion[] } = {}
  for (const [projectId, versions] of localVersionStore.entries()) {
    result[projectId] = versions
  }
  
  return result
}
