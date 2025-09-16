import { NextRequest, NextResponse } from "next/server"
import { updateVersion, deleteVersion, getVersionById } from "@/lib/version-storage"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const resolvedParams = await params
    const body = await request.json()

    const updatedVersion = await updateVersion(resolvedParams.id, resolvedParams.versionId, body)
    
    if (!updatedVersion) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    }

    return NextResponse.json({ version: updatedVersion })
  } catch (error) {
    console.error('Failed to update version:', error)
    return NextResponse.json({ error: 'Failed to update version' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const resolvedParams = await params

    const success = await deleteVersion(resolvedParams.id, resolvedParams.versionId)
    
    if (!success) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete version:', error)
    return NextResponse.json({ error: 'Failed to delete version' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const resolvedParams = await params
    const body = await request.json()

    const updatedVersion = await updateVersion(resolvedParams.id, resolvedParams.versionId, body)
    
    if (!updatedVersion) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    }

    return NextResponse.json({ version: updatedVersion })
  } catch (error) {
    console.error('Failed to update version:', error)
    return NextResponse.json({ error: 'Failed to update version' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const resolvedParams = await params
    const version = await getVersionById(resolvedParams.id, resolvedParams.versionId)
    
    if (!version) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    }

    return NextResponse.json({ version })
  } catch (error) {
    console.error('Failed to get version:', error)
    return NextResponse.json({ error: 'Failed to get version' }, { status: 500 })
  }
}
