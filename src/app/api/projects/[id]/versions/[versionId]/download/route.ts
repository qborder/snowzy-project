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

    // Get the file data
    const fileData = await getFileById(assetId)
    if (!fileData) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Update download count
    await updateVersionDownloads(resolvedParams.id, resolvedParams.versionId)

    // Redirect to the blob URL for download
    return NextResponse.redirect(fileData.blobUrl)
  } catch (error) {
    console.error('Failed to process download:', error)
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
}
