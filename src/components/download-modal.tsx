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
    if (lowercaseUrl.includes('.zip')) {
      return { icon: FileArchive, type: 'ZIP Archive', size: '~2-50MB', description: 'Compressed folder containing all project files' }
    } else if (lowercaseUrl.includes('.rar') || lowercaseUrl.includes('.7z')) {
      return { icon: FileArchive, type: 'Archive', size: '~2-50MB', description: 'Compressed archive with project files' }
    } else if (lowercaseUrl.includes('.exe') || lowercaseUrl.includes('.msi')) {
      return { icon: Shield, type: 'Executable', size: '~5-100MB', description: 'Ready-to-run application installer' }
    } else {
      return { icon: FileText, type: 'File', size: '~1-20MB', description: 'Project file or document' }
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
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 rounded-3xl"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-2xl"></div>
      
      <ModalHeader className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl border border-blue-500/30">
            <Download className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <ModalTitle className="bg-gradient-to-r from-foreground to-blue-600 bg-clip-text text-transparent">
              Download Project
            </ModalTitle>
          </div>
        </div>
        <ModalDescription>
          Ready to download <span className="font-semibold text-foreground">{project.title}</span>? This will include all source files and documentation.
        </ModalDescription>
      </ModalHeader>

      <ModalContent className="space-y-6 relative z-10">
        {fileInfo && (
          <div className="bg-gradient-to-r from-background/80 to-background/60 rounded-2xl p-4 border border-white/10 hover:border-white/20 hover:from-background/90 hover:to-background/70 transition-all duration-300">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg hover:bg-primary/15 transition-colors duration-200">
                <FileIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{fileInfo.type}</span>
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    {fileInfo.size}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {fileInfo.description}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl p-3 border border-green-500/20 hover:border-green-500/30 hover:from-green-500/15 hover:to-green-600/8 transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Included</span>
            </div>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Source code</li>
              <li>• Documentation</li>
              <li>• Assets & resources</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-3 border border-blue-500/20 hover:border-blue-500/30 hover:from-blue-500/15 hover:to-blue-600/8 transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Details</span>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div>Downloads: {project.downloads?.toLocaleString() || 0}</div>
              <div>Format: {fileInfo?.type || 'File'}</div>
              {project.tags && <div>Tags: {project.tags.length}</div>}
            </div>
          </div>
        </div>

        {project.tags && project.tags.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Technologies Used</span>
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

        <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 rounded-xl p-3 border border-amber-500/20 hover:border-amber-500/30 hover:from-amber-500/15 hover:to-amber-600/8 transition-all duration-300 hover:scale-105 cursor-default">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
            <div className="text-xs text-amber-700 dark:text-amber-400 space-y-1">
              <p className="font-medium">License & Usage</p>
              <p className="text-amber-600/80 dark:text-amber-400/80">
                Please respect the project license and give proper attribution when using this code.
              </p>
            </div>
          </div>
        </div>
        
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

      <ModalFooter className="relative z-20">
        <Button 
          variant="outline" 
          onClick={onClose}
          className="bg-background/60 border-white/20 hover:bg-background hover:border-white/40 hover:scale-105 transition-all duration-200 hover:shadow-md relative z-10"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleDownload}
          disabled={isDownloading || downloadComplete}
          className={`${downloadError ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'} hover:scale-105 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 relative z-10 disabled:hover:scale-100`}
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
