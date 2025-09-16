import { NextRequest, NextResponse } from "next/server"
import { getVersionById, updateVersionDownloads } from "@/lib/version-storage"
import { getFileById } from "@/lib/file-storage"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const resolvedParams = await params
    const { searchParams } = new URL(request.url)
    const assetId = searchParams.get('assetId')
    
    if (!assetId) {
      return NextResponse.json({ error: 'Asset ID is required' }, { status: 400 })
    }

    // Get the version to find the asset
    const version = await getVersionById(resolvedParams.id, resolvedParams.versionId)
    if (!version) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    }

    // Find the asset in the version
    const asset = version.assets.find(a => a.id === assetId)
    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    // Get file data to find the display name
    const fileData = await getFileById(assetId)
    if (!fileData) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Update download count
    await updateVersionDownloads(resolvedParams.id, resolvedParams.versionId)

    // Redirect to the proper file download URL that handles filenames correctly
    return NextResponse.redirect(`${new URL(request.url).origin}/api/files/${encodeURIComponent(fileData.displayName)}`)
  } catch (error) {
    console.error('Failed to process download:', error)
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
}
