import { NextRequest, NextResponse } from "next/server"
import { createVersion, getVersionsByProjectId } from "@/lib/version-storage"
import { ProjectVersion } from "@/types/project"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    const versions = await getVersionsByProjectId(projectId)
    
    return NextResponse.json(versions)
  } catch (error) {
    console.error('Failed to fetch versions:', error)
    return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    const body = await request.json()
    
    const { tag, title, description, type, assets, isPrerelease } = body
    
    if (!tag || !title || !description || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: tag, title, description, type' },
        { status: 400 }
      )
    }

    const version = await createVersion(projectId, {
      tag,
      title,
      description,
      type: type as ProjectVersion['type'],
      assets: assets || [],
      isPrerelease: isPrerelease || false
    })

    return NextResponse.json({ success: true, version })
  } catch (error) {
    console.error('Failed to create version:', error)
    return NextResponse.json({ error: 'Failed to create version' }, { status: 500 })
  }
}
