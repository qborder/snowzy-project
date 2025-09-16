import { NextRequest, NextResponse } from "next/server"
import { createVersion, getVersionsByProjectId, updateVersion, deleteVersion } from "@/lib/version-storage"
import { ProjectVersion } from "@/types/project"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const versions = await getVersionsByProjectId(resolvedParams.id)
    return NextResponse.json(versions)
  } catch (error) {
    console.error('Failed to fetch versions:', error)
    return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const body = await request.json()
    const { tag, title, description, type, assets, isPrerelease } = body
    
    if (!tag || !title) {
      return NextResponse.json({ error: 'Tag and title are required' }, { status: 400 })
    }

    const versionData = {
      tag,
      title,
      description: description || '',
      type: type || 'stable',
      assets: assets || [],
      isPrerelease: isPrerelease || false
    }

    const version = await createVersion(resolvedParams.id, versionData)
    return NextResponse.json({ version }, { status: 201 })
  } catch (error) {
    console.error('Failed to create version:', error)
    return NextResponse.json({ error: 'Failed to create version' }, { status: 500 })
  }
}

