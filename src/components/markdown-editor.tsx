"use client"

import { useState, useCallback, useRef } from "react"
import dynamic from "next/dynamic"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Eye, Edit, FileText, Copy, Download, Save, Maximize2, Minimize2, RotateCcw, Zap } from "lucide-react"
import { toast } from "sonner"

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
)

const MarkdownPreview = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default.Markdown),
  { ssr: false }
)

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: number
  onSave?: () => void
  autoSave?: boolean
  showStats?: boolean
}

export function MarkdownEditor({ 
  value, 
  onChange, 
  placeholder = "Enter markdown content...", 
  height = 400,
  onSave,
  autoSave = false,
  showStats = true
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<"edit" | "preview" | "raw">("edit")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const updateStats = useCallback((content: string) => {
    setCharCount(content.length)
    setWordCount(content.trim() ? content.trim().split(/\s+/).length : 0)
  }, [])
  
  const handleChange = useCallback((newValue: string) => {
    onChange(newValue)
    updateStats(newValue)
  }, [onChange, updateStats])
  
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success("Content copied to clipboard!")
    } catch (err) {
      toast.error("Failed to copy content")
    }
  }, [value])
  
  const downloadAsFile = useCallback(() => {
    const blob = new Blob([value], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'content.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("File downloaded!")
  }, [value])
  
  const insertTemplate = useCallback((template: string) => {
    const currentValue = value || ""
    const newValue = currentValue + (currentValue ? "\n" : "") + template
    handleChange(newValue)
    toast.success("Template inserted!")
  }, [value, handleChange])

  return (
    <Card className={`transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Markdown Editor</CardTitle>
              {showStats && (
                <div className="flex items-center gap-3 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {wordCount} words
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {charCount} characters
                  </Badge>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 mr-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyToClipboard}
                className="h-8 px-2"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={downloadAsFile}
                className="h-8 px-2"
              >
                <Download className="h-4 w-4" />
              </Button>
              {onSave && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onSave}
                  className="h-8 px-2"
                >
                  <Save className="h-4 w-4" />
                </Button>
              )}
              <Separator orientation="vertical" className="h-4" />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="h-8 px-2"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
            <Tabs value={mode} onValueChange={(v) => setMode(v as "edit" | "preview" | "raw")} className="w-auto">
              <TabsList className="grid w-full grid-cols-3 h-9">
                <TabsTrigger value="edit" className="flex items-center gap-1 text-xs px-3">
                  <Edit className="h-3 w-3" />
                  Edit
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-1 text-xs px-3">
                  <Eye className="h-3 w-3" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="raw" className="flex items-center gap-1 text-xs px-3">
                  <FileText className="h-3 w-3" />
                  Raw
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        {mode === "edit" && (
          <div className="flex items-center gap-2 pt-3 border-t border-border/50">
            <div className="flex items-center gap-2 flex-wrap">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => insertTemplate("**Bold Text**")}
                className="h-8 px-3 text-xs rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 hover:from-primary/20 hover:to-primary/10 hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <strong className="text-primary">B</strong>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => insertTemplate("*Italic Text*")}
                className="h-8 px-3 text-xs rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:from-blue-500/20 hover:to-blue-500/10 hover:border-blue-500/30 transition-all duration-200 shadow-sm hover:shadow-md italic"
              >
                <span className="text-blue-500">I</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => insertTemplate("`Code`")}
                className="h-8 px-3 text-xs rounded-xl bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500/20 hover:from-green-500/20 hover:to-green-500/10 hover:border-green-500/30 transition-all duration-200 shadow-sm hover:shadow-md font-mono"
              >
                <span className="text-green-500">Code</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => insertTemplate("[Link Text](https://example.com)")}
                className="h-8 px-3 text-xs rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-500/5 border-purple-500/20 hover:from-purple-500/20 hover:to-purple-500/10 hover:border-purple-500/30 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <span className="text-purple-500">Link</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => insertTemplate("\n```\nCode Block\n```\n")}
                className="h-8 px-3 text-xs rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-500/5 border-orange-500/20 hover:from-orange-500/20 hover:to-orange-500/10 hover:border-orange-500/30 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <span className="text-orange-500">Block</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => insertTemplate("\n- List Item\n- List Item\n")}
                className="h-8 px-3 text-xs rounded-xl bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border-cyan-500/20 hover:from-cyan-500/20 hover:to-cyan-500/10 hover:border-cyan-500/30 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <span className="text-cyan-500">List</span>
              </Button>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {mode === "edit" && (
          <div className="markdown-editor-container">
            <style jsx global>{`
              .w-md-editor {
                background-color: transparent !important;
                border: 1px solid hsl(var(--border)) !important;
                border-radius: 16px !important;
                overflow: hidden !important;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
              }
              .w-md-editor-text-input, .w-md-editor-text-area, .w-md-editor-text {
                background-color: hsl(var(--background)) !important;
                color: hsl(var(--foreground)) !important;
                border: none !important;
                border-radius: 0 0 16px 0 !important;
              }
              .w-md-editor-bar {
                background-color: hsl(var(--muted)/0.8) !important;
                border-bottom: 1px solid hsl(var(--border)) !important;
                border-radius: 16px 16px 0 0 !important;
                backdrop-filter: blur(8px) !important;
              }
              .w-md-editor-bar button {
                color: hsl(var(--muted-foreground)) !important;
                border: none !important;
                background: transparent !important;
                border-radius: 8px !important;
                margin: 0 2px !important;
                transition: all 0.2s ease !important;
              }
              .w-md-editor-bar button:hover {
                background-color: hsl(var(--accent)) !important;
                color: hsl(var(--accent-foreground)) !important;
                transform: scale(1.05) !important;
              }
              .w-md-editor-bar button[data-name="fullscreen"] {
                border-radius: 50% !important;
              }
              .wmde-markdown {
                background-color: hsl(var(--background)) !important;
                color: hsl(var(--foreground)) !important;
                border-radius: 0 0 0 16px !important;
                padding: 16px !important;
              }
              .wmde-markdown h1, .wmde-markdown h2, .wmde-markdown h3, .wmde-markdown h4, .wmde-markdown h5, .wmde-markdown h6 {
                color: hsl(var(--foreground)) !important;
                margin-top: 1.5rem !important;
                margin-bottom: 0.5rem !important;
              }
              .wmde-markdown pre {
                background-color: hsl(var(--muted)) !important;
                border: 1px solid hsl(var(--border)) !important;
                border-radius: 12px !important;
                padding: 16px !important;
                margin: 16px 0 !important;
              }
              .wmde-markdown code {
                background-color: hsl(var(--muted)) !important;
                color: hsl(var(--foreground)) !important;
                padding: 4px 8px !important;
                border-radius: 8px !important;
                font-size: 0.875rem !important;
              }
              .wmde-markdown blockquote {
                border-left: 4px solid hsl(var(--primary)) !important;
                background-color: hsl(var(--muted)) !important;
                color: hsl(var(--muted-foreground)) !important;
                border-radius: 0 12px 12px 0 !important;
                margin: 16px 0 !important;
                padding: 16px !important;
              }
              .wmde-markdown ul, .wmde-markdown ol {
                padding-left: 24px !important;
              }
              .wmde-markdown li {
                margin: 8px 0 !important;
              }
              .wmde-markdown table {
                border-radius: 12px !important;
                overflow: hidden !important;
                border: 1px solid hsl(var(--border)) !important;
              }
              .wmde-markdown th, .wmde-markdown td {
                border: 1px solid hsl(var(--border)) !important;
                padding: 12px !important;
              }
              .wmde-markdown th {
                background-color: hsl(var(--muted)) !important;
                font-weight: 600 !important;
              }
            `}</style>
            <MDEditor
              value={value}
              onChange={(val) => handleChange(val || "")}
              height={isFullscreen ? window.innerHeight - 250 : height}
              preview="edit"
              hideToolbar={false}
              textareaProps={{
                placeholder,
                style: {
                  fontSize: 14,
                  backgroundColor: "transparent",
                  fontFamily: "ui-monospace, SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace",
                  lineHeight: 1.6
                }
              }}
            />
          </div>
        )}
        
        {mode === "preview" && (
          <div data-color-mode="auto" className="preview-container">
            <MDEditor
              value={value}
              onChange={() => {}}
              height={isFullscreen ? window.innerHeight - 200 : height}
              preview="preview"
              hideToolbar
            />
          </div>
        )}
        
        {mode === "raw" && (
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className="w-full font-mono text-sm resize-y min-h-96 focus:ring-2 focus:ring-primary/20 transition-all"
            style={{ minHeight: isFullscreen ? 'calc(100vh - 200px)' : height }}
          />
        )}
      </CardContent>
    </Card>
  )
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

function processContentWithYouTube(content: string): string {
  const youtubeRegex = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^\s&\n?#]+)/g
  
  return content.replace(youtubeRegex, (match) => {
    const videoId = extractYouTubeId(match)
    if (!videoId) return match
    
    return `<div class="youtube-embed my-6">
      <div class="relative w-full rounded-lg overflow-hidden shadow-lg" style="padding-bottom: 56.25%;">
        <iframe 
          class="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube.com/embed/${videoId}"
          title="YouTube video"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>
    </div>`
  })
}

export function MarkdownViewer({ content }: { content: string }) {
  if (!content?.trim()) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No content available</p>
      </div>
    )
  }

  const processedContent = processContentWithYouTube(content)

  return (
    <div data-color-mode="auto">
      <MarkdownPreview 
        source={processedContent} 
        style={{ 
          backgroundColor: "transparent",
          color: "inherit"
        }}
        components={{
          div: ({ className, ...props }) => {
            if (className === 'youtube-embed') {
              return <div className="youtube-embed my-6" {...props} />
            }
            return <div className={className} {...props} />
          }
        }}
      />
    </div>
  )
}
