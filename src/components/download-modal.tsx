"use client"

import { useState } from "react"
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileArchive, FileText, Code, Shield, CheckCircle, AlertTriangle, Info } from "lucide-react"

type Project = {
  id?: string
  title: string
  downloadUrl?: string
  tags?: string[]
  downloads?: number
}

interface DownloadModalProps {
  isOpen: boolean
  onClose: () => void
  project: Project
  onDownloadComplete: (newDownloadCount: number) => void
}

export function DownloadModal({ isOpen, onClose, project, onDownloadComplete }: DownloadModalProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  const getFileTypeInfo = (url: string) => {
    const lowercaseUrl = url.toLowerCase()
    const filename = url.split('/').pop() || ''
    
    if (lowercaseUrl.includes('.zip')) {
      return { 
        icon: FileArchive, 
        type: 'ZIP Archive', 
        size: 'Compressed file', 
        description: 'Downloadable ZIP archive',
        isArchive: true
      }
    } else if (lowercaseUrl.includes('.rar')) {
      return { 
        icon: FileArchive, 
        type: 'RAR Archive', 
        size: 'Compressed file', 
        description: 'Downloadable RAR archive',
        isArchive: true
      }
    } else if (lowercaseUrl.includes('.7z')) {
      return { 
        icon: FileArchive, 
        type: '7Z Archive', 
        size: 'Compressed file', 
        description: 'Downloadable 7Z archive',
        isArchive: true
      }
    } else if (lowercaseUrl.includes('.exe')) {
      return { 
        icon: Shield, 
        type: 'Executable', 
        size: 'Application file', 
        description: 'Windows executable file',
        isArchive: false
      }
    } else if (lowercaseUrl.includes('.msi')) {
      return { 
        icon: Shield, 
        type: 'Installer', 
        size: 'Installation package', 
        description: 'Windows installer package',
        isArchive: false
      }
    } else if (lowercaseUrl.includes('.pdf')) {
      return { 
        icon: FileText, 
        type: 'PDF Document', 
        size: 'Document file', 
        description: 'Portable Document Format file',
        isArchive: false
      }
    } else if (lowercaseUrl.includes('.docx') || lowercaseUrl.includes('.doc')) {
      return { 
        icon: FileText, 
        type: 'Word Document', 
        size: 'Document file', 
        description: 'Microsoft Word document',
        isArchive: false
      }
    } else if (lowercaseUrl.includes('.rbxm') || lowercaseUrl.includes('.rbxml') || lowercaseUrl.includes('.rbxmx') || lowercaseUrl.includes('.rbxmlx')) {
      return { 
        icon: Code, 
        type: 'Roblox Model', 
        size: 'Game asset', 
        description: 'Roblox model file for Studio',
        isArchive: false
      }
    } else if (lowercaseUrl.includes('.rbxl') || lowercaseUrl.includes('.rbxlx')) {
      return { 
        icon: Code, 
        type: 'Roblox Place', 
        size: 'Game file', 
        description: 'Roblox place file for Studio',
        isArchive: false
      }
    } else {
      return { 
        icon: FileText, 
        type: 'File', 
        size: 'Download file', 
        description: filename || 'Downloadable file',
        isArchive: false
      }
    }
  }

  async function handleDownload() {
    if (!project.downloadUrl || !project.id) {
      console.error('Missing download URL or project ID')
      setDownloadError('Invalid download configuration')
      return
    }
    
    setDownloadError(null)
    
    setIsDownloading(true)
    
    try {
      // Increment download counter with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
      }, 5000) // 5 second timeout
      
      try {
        const response = await fetch(`/api/projects/${project.id}/downloads`, {
          method: 'POST',
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        
        if (response.ok) {
          const data = await response.json()
          onDownloadComplete(data.downloads)
        } else {
          console.error('Download counter API failed:', response.status)
        }
      } catch (fetchError) {
        clearTimeout(timeoutId)
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          console.log('Download counter request timed out, continuing with download')
        } else {
          console.error('Download counter API error:', fetchError)
        }
        // Continue with download even if counter fails
      }
      
      // Start download
      const link = document.createElement('a')
      link.href = project.downloadUrl
      link.download = ''
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setDownloadComplete(true)
      setIsDownloading(false)
      
      setTimeout(() => {
        setDownloadComplete(false)
        onClose()
      }, 2000)
      
    } catch (error) {
      console.error('Download failed:', error)
      setIsDownloading(false)
      setDownloadError('Download failed. Please try again.')
      
      setTimeout(() => {
        setDownloadError(null)
      }, 3000)
    }
  }

  const fileInfo = project.downloadUrl ? getFileTypeInfo(project.downloadUrl) : null
  const FileIcon = fileInfo?.icon || FileText

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl w-full mx-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-purple-500/8 rounded-3xl animate-pulse-subtle"></div>
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/15 to-transparent rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-2xl animate-float-delayed"></div>
      
      <ModalHeader className="relative z-10 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-4 bg-gradient-to-br from-blue-500/25 to-blue-600/15 rounded-2xl border border-blue-500/40 shadow-lg backdrop-blur-sm animate-bounce-subtle">
            <Download className="h-7 w-7 text-blue-600" />
          </div>
          <div className="flex-1">
            <ModalTitle className="text-3xl font-black bg-gradient-to-r from-foreground via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Download Project
            </ModalTitle>
          </div>
        </div>
        <ModalDescription>
          {fileInfo?.isArchive 
            ? `Ready to download ${fileInfo.type.toLowerCase()} for `
            : `Ready to download `
          }<span className="font-semibold text-foreground">{project.title}</span>?
        </ModalDescription>
      </ModalHeader>

      <ModalContent className="space-y-6 relative z-10 px-6">
        {fileInfo && (
          <div className="bg-gradient-to-r from-background/90 to-background/70 rounded-2xl p-4 border border-white/20 hover:border-white/30 hover:from-background hover:to-background/80 transition-all duration-500 hover:scale-[1.02] group shadow-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl hover:from-primary/25 hover:to-primary/15 transition-all duration-300 group-hover:scale-110 shadow-md">
                <FileIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-foreground">{fileInfo.type}</span>
                  <Badge variant="outline" className="text-xs px-2 py-1 bg-primary/10 border-primary/20">
                    {fileInfo.size}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {fileInfo.description}
                </p>
                <div className="text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-2 border border-blue-500/20">
                  <p className="text-sm text-blue-600/80 dark:text-blue-400/80 font-semibold">
                    {fileInfo?.isArchive 
                      ? '📦 Archive ready for download'
                      : `📄 ${fileInfo?.type || 'File'} ready for download`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-500/15 to-blue-600/8 rounded-xl p-5 border border-blue-500/25 hover:border-blue-500/40 hover:from-blue-500/20 hover:to-blue-600/12 transition-all duration-500 hover:scale-105 cursor-default shadow-lg group">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-all duration-300 shadow-sm">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-bold text-blue-700 dark:text-blue-300">File Information</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2.5 bg-blue-500/5 rounded-lg border border-blue-500/10">
                <span className="font-medium text-blue-600/80 text-sm">Type</span>
                <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 font-semibold">
                  {fileInfo?.type || 'File'}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                <span className="font-medium text-emerald-600/80 text-sm">Downloads</span>
                <div className="flex items-center gap-1">
                  <span className="text-emerald-600 font-bold text-lg">{project.downloads?.toLocaleString() || 0}</span>
                  <span className="text-emerald-500 text-xs">times</span>
                </div>
              </div>
              {fileInfo?.size && (
                <div className="flex justify-between items-center p-2.5 bg-purple-500/5 rounded-lg border border-purple-500/10">
                  <span className="font-medium text-purple-600/80 text-sm">Category</span>
                  <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 font-semibold">
                    {fileInfo.size}
                  </Badge>
                </div>
              )}
            </div>
          </div>
          
          {fileInfo?.isArchive && (
            <div className="bg-gradient-to-br from-green-500/15 to-green-600/8 rounded-xl p-5 border border-green-500/25 hover:border-green-500/40 hover:from-green-500/20 hover:to-green-600/12 transition-all duration-500 hover:scale-105 cursor-default shadow-lg group">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-all duration-300 shadow-sm">
                  <FileArchive className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-sm font-bold text-green-700 dark:text-green-300">Archive Contents</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2.5 bg-green-500/5 rounded-lg border border-green-500/10 group-hover:bg-green-500/8 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-bold">📁</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-green-700 dark:text-green-300 font-medium text-sm">Multiple Files</span>
                    <p className="text-green-600/70 dark:text-green-400/70 text-xs">Contains various project assets</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 bg-green-500/5 rounded-lg border border-green-500/10 group-hover:bg-green-500/8 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-bold">🗜️</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-green-700 dark:text-green-300 font-medium text-sm">Compressed Format</span>
                    <p className="text-green-600/70 dark:text-green-400/70 text-xs">Optimized for faster download</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 bg-green-500/5 rounded-lg border border-green-500/10 group-hover:bg-green-500/8 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-bold">📂</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-green-700 dark:text-green-300 font-medium text-sm">Extract After Download</span>
                    <p className="text-green-600/70 dark:text-green-400/70 text-xs">Unzip to access all files</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {!fileInfo?.isArchive && (
            <div className="bg-gradient-to-br from-purple-500/15 to-purple-600/8 rounded-xl p-4 border border-purple-500/25 hover:border-purple-500/40 hover:from-purple-500/20 hover:to-purple-600/12 transition-all duration-500 hover:scale-105 cursor-default shadow-lg group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors duration-300">
                  <Download className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-sm font-bold text-purple-700 dark:text-purple-300">Direct Download</span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">✅ Ready to use</div>
                <div className="flex items-center gap-2">📄 Single file</div>
                <div className="flex items-center gap-2">⚡ Direct access</div>
              </div>
            </div>
          )}
        </div>

        {project.tags && project.tags.length > 0 && fileInfo?.isArchive && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Related Technologies</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.slice(0, 6).map((tag) => (
                <Badge 
                  key={tag}
                  variant="outline" 
                  className="text-xs bg-background/60 border-white/20 hover:border-primary/40 hover:bg-primary/10 hover:scale-105 transition-all duration-200 cursor-default"
                >
                  {tag}
                </Badge>
              ))}
              {project.tags.length > 6 && (
                <Badge variant="outline" className="text-xs bg-background/60 border-white/20 hover:border-primary/20 hover:bg-primary/5 hover:scale-105 transition-all duration-200 cursor-default">
                  +{project.tags.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {fileInfo?.isArchive && (
          <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 rounded-xl p-3 border border-amber-500/20 hover:border-amber-500/30 hover:from-amber-500/15 hover:to-amber-600/8 transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div className="text-xs text-amber-700 dark:text-amber-400 space-y-1">
                <p className="font-medium">Usage Note</p>
                <p className="text-amber-600/80 dark:text-amber-400/80">
                  Extract the archive contents before use. Check for documentation inside.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {downloadError && (
          <div className="bg-gradient-to-r from-red-500/10 to-red-600/5 rounded-xl p-3 border border-red-500/20 mt-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
              <div className="text-xs text-red-700 dark:text-red-400">
                <p className="font-medium">Download Error</p>
                <p className="text-red-600/80 dark:text-red-400/80">{downloadError}</p>
              </div>
            </div>
          </div>
        )}
      </ModalContent>

      <ModalFooter className="relative z-20 px-6 pt-4 gap-3">
        <Button 
          variant="outline" 
          onClick={onClose}
          className="flex-1 h-10 bg-background/70 border-white/30 hover:bg-background hover:border-white/50 hover:scale-105 transition-all duration-300 hover:shadow-lg relative z-10 rounded-lg font-semibold"
          size="lg"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleDownload}
          disabled={isDownloading || downloadComplete}
          className={`flex-1 h-10 ${downloadError ? 'bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900' : 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900'} hover:scale-105 text-white border-0 shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 relative z-10 disabled:hover:scale-100 rounded-lg font-bold`}
          size="lg"
        >
          {downloadError ? (
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Try Again</span>
            </div>
          ) : downloadComplete ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Downloaded!</span>
            </div>
          ) : isDownloading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              <span>Downloading...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Start Download</span>
            </div>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
