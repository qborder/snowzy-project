"use client"

import React, { useState, useCallback, useRef, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Eye, Edit, FileText, Copy, Download, Save, Maximize2, Minimize2, 
  Bold, Italic, Code, Link, List, Image, Quote, Table, Heading,
  Sparkles, Zap, Settings, Palette, CheckSquare, Terminal, Check
} from "lucide-react"
import { toast } from "sonner"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from 'next-themes'

interface CodeBlockProps {
  language: string
  children: string
  showLineNumbers?: boolean
}

function CodeBlock({ language, children, showLineNumbers = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const { theme } = useTheme()
  
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      toast.success("Code copied!", { icon: "📋", duration: 1500 })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Failed to copy code")
    }
  }
  
  const getLanguageIcon = (lang: string) => {
    const iconMap: Record<string, string> = {
      javascript: "JS",
      typescript: "TS",
      python: "PY",
      java: "JAVA",
      cpp: "C++",
      c: "C",
      html: "HTML",
      css: "CSS",
      json: "JSON",
      xml: "XML",
      sql: "SQL",
      bash: "BASH",
      shell: "SH",
      rust: "RS",
      go: "GO",
      php: "PHP"
    }
    return iconMap[lang.toLowerCase()] || "CODE"
  }
  
  return (
    <div className="group relative my-6 overflow-hidden rounded-lg border border-border/40 bg-background shadow-md hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="px-2 py-1 text-xs font-mono font-semibold bg-primary/10 text-primary rounded border border-primary/20">
            {getLanguageIcon(language)}
          </div>
          <span className="text-sm text-muted-foreground font-mono">{language}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={copyCode}
          className="h-8 px-3 text-xs border-transparent hover:border-border/60 hover:bg-background/80 transition-all duration-200"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 mr-1.5 text-green-600" />
              <span className="text-green-600 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 mr-1.5" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>
      <div className="relative">
        <SyntaxHighlighter
          style={theme === 'dark' ? vscDarkPlus : vs}
          language={language}
          PreTag="div"
          showLineNumbers={showLineNumbers}
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            color: theme === 'dark' ? '#6B7280' : '#9CA3AF',
            borderRight: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
            marginRight: '1em',
            textAlign: 'right',
            userSelect: 'none',
            backgroundColor: 'transparent'
          }}
          customStyle={{
            margin: 0,
            padding: '1.25rem',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: '1.6',
            fontFamily: 'JetBrains Mono, Fira Code, ui-monospace, SFMono-Regular, SF Mono, Monaco, Consolas, Liberation Mono, DejaVu Sans Mono, monospace',
            color: 'inherit',
            textShadow: 'none',
            filter: 'none'
          }}
          codeTagProps={{
            style: {
              color: 'inherit',
              background: 'transparent',
              textShadow: 'none',
              filter: 'none'
            }
          }}
        >
          {children.replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

interface MarkdownEditorEnhancedProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: number
  onSave?: () => void
  autoSave?: boolean
  showStats?: boolean
  theme?: 'default' | 'minimal' | 'professional'
}

export function MarkdownEditorEnhanced({ 
  value, 
  onChange, 
  placeholder = "Start writing your markdown...", 
  height = 500,
  onSave,
  autoSave = false,
  showStats = true,
  theme = 'default'
}: MarkdownEditorEnhancedProps) {
  const [mode, setMode] = useState<"edit" | "preview" | "split">("split")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [lineCount, setLineCount] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const updateStats = useCallback((content: string) => {
    setCharCount(content.length)
    setWordCount(content.trim() ? content.trim().split(/\s+/).length : 0)
    setLineCount(content.split('\n').length)
  }, [])
  
  const handleChange = useCallback((newValue: string) => {
    onChange(newValue)
    updateStats(newValue)
  }, [onChange, updateStats])
  
  useEffect(() => {
    updateStats(value)
  }, [value, updateStats])
  
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success("Content copied to clipboard!", {
        icon: "📋"
      })
    } catch (err) {
      toast.error("Failed to copy content")
    }
  }, [value])
  
  const downloadAsFile = useCallback(() => {
    const blob = new Blob([value], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `content-${Date.now()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("File downloaded!", {
      icon: "💾"
    })
  }, [value])
  
  const insertAtCursor = useCallback((before: string, after: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const replacement = before + (selectedText || placeholder) + after
    
    const newValue = value.substring(0, start) + replacement + value.substring(end)
    handleChange(newValue)
    
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + (selectedText || placeholder).length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
    
    toast.success("Template inserted!", {
      icon: "✨",
      duration: 1500
    })
  }, [value, handleChange])

  const toolbarActions = [
    { icon: Bold, label: "Bold", action: () => insertAtCursor("**", "**", "bold text"), color: "text-blue-500", bg: "from-blue-500/10 to-blue-500/5", border: "border-blue-500/20", hoverBg: "hover:from-blue-500/20 hover:to-blue-500/10", hoverBorder: "hover:border-blue-500/30" },
    { icon: Italic, label: "Italic", action: () => insertAtCursor("*", "*", "italic text"), color: "text-purple-500", bg: "from-purple-500/10 to-purple-500/5", border: "border-purple-500/20", hoverBg: "hover:from-purple-500/20 hover:to-purple-500/10", hoverBorder: "hover:border-purple-500/30" },
    { icon: Code, label: "Code", action: () => insertAtCursor("`", "`", "code"), color: "text-green-500", bg: "from-green-500/10 to-green-500/5", border: "border-green-500/20", hoverBg: "hover:from-green-500/20 hover:to-green-500/10", hoverBorder: "hover:border-green-500/30" },
    { icon: Link, label: "Link", action: () => insertAtCursor("[", "](https://example.com)", "link text"), color: "text-cyan-500", bg: "from-cyan-500/10 to-cyan-500/5", border: "border-cyan-500/20", hoverBg: "hover:from-cyan-500/20 hover:to-cyan-500/10", hoverBorder: "hover:border-cyan-500/30" },
    { icon: Heading, label: "Heading", action: () => insertAtCursor("## ", "", "heading"), color: "text-orange-500", bg: "from-orange-500/10 to-orange-500/5", border: "border-orange-500/20", hoverBg: "hover:from-orange-500/20 hover:to-orange-500/10", hoverBorder: "hover:border-orange-500/30" },
    { icon: List, label: "List", action: () => insertAtCursor("- ", "", "list item"), color: "text-pink-500", bg: "from-pink-500/10 to-pink-500/5", border: "border-pink-500/20", hoverBg: "hover:from-pink-500/20 hover:to-pink-500/10", hoverBorder: "hover:border-pink-500/30" },
    { icon: Quote, label: "Quote", action: () => insertAtCursor("> ", "", "quote"), color: "text-indigo-500", bg: "from-indigo-500/10 to-indigo-500/5", border: "border-indigo-500/20", hoverBg: "hover:from-indigo-500/20 hover:to-indigo-500/10", hoverBorder: "hover:border-indigo-500/30" },
    { icon: Image, label: "Image", action: () => insertAtCursor("![", "](image-url)", "alt text"), color: "text-emerald-500", bg: "from-emerald-500/10 to-emerald-500/5", border: "border-emerald-500/20", hoverBg: "hover:from-emerald-500/20 hover:to-emerald-500/10", hoverBorder: "hover:border-emerald-500/30" },
    { icon: CheckSquare, label: "Checkbox", action: () => insertAtCursor("- [ ] ", "", "task item"), color: "text-violet-500", bg: "from-violet-500/10 to-violet-500/5", border: "border-violet-500/20", hoverBg: "hover:from-violet-500/20 hover:to-violet-500/10", hoverBorder: "hover:border-violet-500/30" },
  ]

  const themeClasses = {
    default: "bg-background/95 backdrop-blur-xl border-white/20",
    minimal: "bg-background border-border/50",
    professional: "bg-gradient-to-br from-background/95 via-background to-background/90 backdrop-blur-2xl border-primary/20 shadow-2xl"
  }

  return (
    <Card className={`transition-all duration-500 ${isFullscreen ? 'fixed inset-4 z-50 rounded-3xl' : 'rounded-2xl'} ${themeClasses[theme]} shadow-xl hover:shadow-2xl overflow-hidden`}>
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border border-primary/20 shadow-lg">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Enhanced Markdown Editor
              </CardTitle>
              {showStats && (
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20">
                    {wordCount} words
                  </Badge>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-500 border-blue-500/20">
                    {charCount} chars
                  </Badge>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-green-500/10 text-green-500 border-green-500/20">
                    {lineCount} lines
                  </Badge>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyToClipboard}
                className="h-9 px-3 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadAsFile}
                className="h-9 px-3 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Download className="h-4 w-4" />
              </Button>
              {onSave && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onSave}
                  className="h-9 px-3 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Save className="h-4 w-4" />
                </Button>
              )}
              <Separator orientation="vertical" className="h-5 bg-primary/20 rounded-full" />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="h-9 px-3 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
            <Tabs value={mode} onValueChange={(v) => setMode(v as "edit" | "preview" | "split")} className="w-auto">
              <TabsList className="grid w-full grid-cols-3 h-11 bg-muted/50 backdrop-blur-sm rounded-xl border border-white/10">
                <TabsTrigger value="edit" className="flex items-center gap-2 text-sm px-4 rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all duration-200">
                  <Edit className="h-4 w-4" />
                  Edit
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2 text-sm px-4 rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all duration-200">
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="split" className="flex items-center gap-2 text-sm px-4 rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all duration-200">
                  <Zap className="h-4 w-4" />
                  Split
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="flex items-center gap-2 pt-4 border-t border-border/30">
          <div className="flex items-center gap-1.5 flex-wrap">
            {toolbarActions.map((tool, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={tool.action}
                className={`h-8 px-2.5 text-xs rounded-lg bg-gradient-to-r ${tool.bg} border ${tool.border} ${tool.hoverBg} ${tool.hoverBorder} transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 group`}
              >
                <tool.icon className={`h-3.5 w-3.5 ${tool.color} mr-1.5 group-hover:animate-pulse`} />
                <span className={`${tool.color} font-medium`}>{tool.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className={`${mode === 'split' ? 'grid grid-cols-2' : ''} ${isFullscreen ? 'h-[calc(100vh-250px)]' : 'h-[500px]'}`}>
          {(mode === 'edit' || mode === 'split') && (
            <div className={`${mode === 'split' ? 'border-r border-border/30' : ''} flex flex-col`}>
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={placeholder}
                className="flex-1 resize-none border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent font-mono text-sm leading-relaxed p-6"
                style={{ 
                  minHeight: isFullscreen ? 'calc(100vh - 250px)' : height,
                  fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Consolas, 'Liberation Mono', 'DejaVu Sans Mono', monospace"
                }}
              />
            </div>
          )}
          
          {(mode === 'preview' || mode === 'split') && (
            <div className="flex flex-col overflow-hidden">
              <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background/50 to-muted/20">
                <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:scroll-m-20 prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h1:font-extrabold prose-h1:text-foreground prose-h1:mb-6 prose-h2:text-3xl prose-h2:font-bold prose-h2:text-foreground prose-h2:mb-4 prose-h2:border-b prose-h2:border-border prose-h2:pb-2 prose-h3:text-2xl prose-h3:font-semibold prose-h3:text-foreground prose-h3:mb-3 prose-h4:text-xl prose-h4:font-semibold prose-h4:text-foreground prose-h4:mb-2 prose-h5:text-lg prose-h5:font-medium prose-h5:text-foreground prose-h5:mb-2 prose-h6:text-base prose-h6:font-medium prose-h6:text-foreground prose-h6:mb-2 prose-p:text-foreground prose-p:leading-7 prose-p:mb-4 prose-strong:text-foreground prose-strong:font-semibold prose-em:text-foreground prose-em:italic prose-code:text-foreground prose-code:font-mono prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-a:text-primary prose-a:underline prose-a:decoration-primary/30 prose-a:underline-offset-4 hover:prose-a:decoration-primary prose-ul:space-y-2 prose-ul:list-disc prose-ul:pl-6 prose-ol:space-y-2 prose-ol:list-decimal prose-ol:pl-6 prose-li:text-foreground prose-li:leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({children}) => (
                        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-foreground mb-6 pb-2 border-b-2 border-border/60">
                          {children}
                        </h1>
                      ),
                      h2: ({children}) => (
                        <h2 className="scroll-m-20 text-3xl font-bold tracking-tight text-foreground mb-4 pb-2 border-b border-border/50">
                          {children}
                        </h2>
                      ),
                      h3: ({children}) => (
                        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-foreground mb-3">
                          {children}
                        </h3>
                      ),
                      h4: ({children}) => (
                        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-foreground mb-2">
                          {children}
                        </h4>
                      ),
                      h5: ({children}) => (
                        <h5 className="scroll-m-20 text-lg font-medium tracking-tight text-foreground mb-2">
                          {children}
                        </h5>
                      ),
                      h6: ({children}) => (
                        <h6 className="scroll-m-20 text-base font-medium tracking-tight text-foreground mb-2">
                          {children}
                        </h6>
                      ),
                      p: ({children}) => (
                        <p className="leading-7 text-foreground mb-4">
                          {children}
                        </p>
                      ),
                      a: ({href, children}) => (
                        <a 
                          href={href} 
                          className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-colors font-medium"
                          target={href?.startsWith('http') ? '_blank' : undefined}
                          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {children}
                        </a>
                      ),
                      ul: ({children, className}) => {
                        const isTaskList = className?.includes('contains-task-list')
                        return (
                          <ul className={`space-y-2 mb-4 ${isTaskList ? 'list-none pl-0' : 'list-disc pl-6'}`}>
                            {children}
                          </ul>
                        )
                      },
                      ol: ({children}) => (
                        <ol className="space-y-2 list-decimal pl-6 mb-4">
                          {children}
                        </ol>
                      ),
                      li: ({children, className}) => {
                        const isTaskListItem = className?.includes('task-list-item')
                        return (
                          <li className={`text-foreground leading-relaxed ${isTaskListItem ? 'list-none' : ''}`}>
                            {children}
                          </li>
                        )
                      },
                      input: ({type, checked, disabled}) => {
                        if (type === 'checkbox') {
                          return (
                            <input 
                              type="checkbox" 
                              checked={checked}
                              disabled={disabled}
                              className="mr-2 h-4 w-4 rounded border-border/50 text-primary focus:ring-primary/30 focus:ring-2 bg-background cursor-pointer disabled:cursor-default align-baseline translate-y-[1px]"
                              readOnly
                            />
                          )
                        }
                        return <input type={type} checked={checked} disabled={disabled} />
                      },
                      code: ({inline, className, children}: {inline?: boolean, className?: string, children?: React.ReactNode}) => {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <CodeBlock language={match[1]}>
                            {String(children)}
                          </CodeBlock>
                        ) : (
                          <code className="bg-gradient-to-r from-primary/10 to-primary/5 text-foreground px-2.5 py-1.5 rounded-lg text-sm font-mono border border-primary/20 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] hover:border-primary/30 font-semibold">
                            {children}
                          </code>
                        )
                      },
                      blockquote: ({children}) => (
                        <blockquote className="border-l-4 border-primary/60 bg-muted/50 p-4 rounded-lg my-4 italic text-foreground/90">
                          {children}
                        </blockquote>
                      ),
                      table: ({children}) => (
                        <div className="overflow-x-auto rounded-xl border border-border/20 shadow-sm my-4">
                          <table className="min-w-full">{children}</table>
                        </div>
                      ),
                      th: ({children}) => (
                        <th className="bg-primary/10 px-4 py-3 text-left font-semibold border-b border-border/20 text-foreground">
                          {children}
                        </th>
                      ),
                      td: ({children}) => (
                        <td className="px-4 py-3 border-b border-border/10 text-foreground">
                          {children}
                        </td>
                      ),
                      strong: ({children}) => (
                        <strong className="font-semibold text-foreground">
                          {children}
                        </strong>
                      ),
                      em: ({children}) => (
                        <em className="italic text-foreground">
                          {children}
                        </em>
                      ),
                      img: ({src, alt, ...props}) => {
                        if (!src || src === '') return null
                        return (
                          <img 
                            src={src} 
                            alt={alt} 
                            className="rounded-lg border border-border/20 shadow-sm max-w-full h-auto my-4"
                            {...props}
                          />
                        )
                      }
                    }}
                  >
                    {value || "*Start typing to see preview...*"}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>
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

const YouTubeEmbed = ({ videoId }: { videoId: string }) => (
  <div className="youtube-embed my-6">
    <div className="relative w-full rounded-lg overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
      <iframe 
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  </div>
)

export function MarkdownViewer({ content }: { content: string }) {
  if (!content?.trim()) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No content available</p>
      </div>
    )
  }

  return (
    <div 
      data-color-mode="auto" 
      className="prose prose-slate dark:prose-invert max-w-none
        prose-headings:scroll-m-20 prose-headings:tracking-tight
        prose-h1:text-4xl prose-h1:font-extrabold prose-h1:lg:text-5xl prose-h1:mb-6
        prose-h2:border-b prose-h2:pb-2 prose-h2:text-3xl prose-h2:font-semibold prose-h2:first:mt-0 prose-h2:mt-12 prose-h2:mb-6
        prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4
        prose-h4:text-xl prose-h4:font-semibold prose-h4:mt-6 prose-h4:mb-3
        prose-p:leading-7 prose-p:mb-6 prose-p:[&:not(:first-child)]:mt-6
        prose-blockquote:mt-6 prose-blockquote:border-l-2 prose-blockquote:border-primary/20 prose-blockquote:pl-6 prose-blockquote:italic
        prose-ul:my-6 prose-ul:ml-6 prose-ul:[&>li]:mt-2
        prose-ol:my-6 prose-ol:ml-6 prose-ol:[&>li]:mt-2
        prose-li:text-muted-foreground
        prose-table:w-full prose-table:my-6 prose-table:border-collapse prose-table:border prose-table:border-muted
        prose-th:border prose-th:border-muted prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-bold prose-th:[&[align=center]]:text-center prose-th:[&[align=right]]:text-right
        prose-td:border prose-td:border-muted prose-td:px-4 prose-td:py-2 prose-td:[&[align=center]]:text-center prose-td:[&[align=right]]:text-right
        prose-tr:m-0 prose-tr:border-t prose-tr:border-muted prose-tr:p-0 prose-tr:even:bg-muted
        prose-img:rounded-lg prose-img:border prose-img:border-muted
        prose-lead:text-xl prose-lead:text-muted-foreground
        prose-large:text-lg prose-large:font-semibold
        prose-small:text-sm prose-small:font-medium prose-small:leading-none
        prose-muted:text-sm prose-muted:text-muted-foreground
        prose-code:relative prose-code:rounded prose-code:bg-muted prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:font-mono prose-code:text-sm prose-code:font-semibold
        prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:border prose-pre:bg-muted prose-pre:p-4"
    >
      <ReactMarkdown
        components={{
          h1: ({children}) => (
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-foreground">
              {children}
            </h1>
          ),
          h2: ({children}) => (
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-12 mb-6 text-foreground">
              {children}
            </h2>
          ),
          h3: ({children}) => (
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4 text-foreground">
              {children}
            </h3>
          ),
          h4: ({children}) => (
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-3 text-foreground">
              {children}
            </h4>
          ),
          blockquote: ({children}) => (
            <blockquote className="mt-6 border-l-2 border-primary/20 pl-6 italic text-muted-foreground bg-muted/30 py-2 rounded-r-lg">
              {children}
            </blockquote>
          ),
          ul: ({children}) => (
            <ul className="my-6 ml-6 list-disc space-y-2 text-foreground [&>li]:mt-2">
              {children}
            </ul>
          ),
          ol: ({children}) => (
            <ol className="space-y-2 list-decimal pl-6 mb-4">
              {children}
            </ol>
          ),
          li: ({children}) => (
            <li className="text-foreground leading-relaxed">
              {children}
            </li>
          ),
          code: ({inline, className, children}: {inline?: boolean, className?: string, children?: React.ReactNode}) => {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <CodeBlock language={match[1]}>
                {String(children)}
              </CodeBlock>
            ) : (
              <code className="bg-gradient-to-r from-primary/10 to-primary/5 text-foreground px-2.5 py-1.5 rounded-lg text-sm font-mono border border-primary/20 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] hover:border-primary/30 font-semibold">
                {children}
              </code>
            )
          },
          table: ({children}) => (
            <div className="my-6 w-full overflow-y-auto">
              <table className="w-full border-collapse border border-border rounded-lg overflow-hidden shadow-sm">
                {children}
              </table>
            </div>
          ),
          th: ({children, ...props}) => (
            <th className="border border-border px-4 py-2 text-left font-bold bg-muted [&[align=center]]:text-center [&[align=right]]:text-right text-foreground" {...props}>
              {children}
            </th>
          ),
          td: ({children, ...props}) => (
            <td className="border border-border px-4 py-2 [&[align=center]]:text-center [&[align=right]]:text-right text-foreground" {...props}>
              {children}
            </td>
          ),
          tr: ({children}) => (
            <tr className="m-0 border-t border-border p-0 even:bg-muted/50 hover:bg-muted/30 transition-colors">
              {children}
            </tr>
          ),
          img: ({src, alt, ...props}) => (
            <div className="my-6">
              <img 
                src={src} 
                alt={alt}
                className="rounded-lg border border-border shadow-md hover:shadow-lg transition-shadow duration-200 max-w-full h-auto"
                {...props}
              />
            </div>
          ),
          a: ({href, children}) => {
            if (href && typeof href === 'string') {
              const videoId = extractYouTubeId(href)
              if (videoId) {
                return <YouTubeEmbed videoId={videoId} />
              }
            }
            return (
              <a 
                href={href} 
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            )
          },
          p: ({children}) => {
            const childrenArray = React.Children.toArray(children)
            const processedChildren: React.ReactNode[] = []
            
            childrenArray.forEach((child, index) => {
              if (typeof child === 'string') {
                const youtubeRegex = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^\s&\n?#]+)/g
                let lastIndex = 0
                let match
                let hasVideo = false
                
                while ((match = youtubeRegex.exec(child)) !== null) {
                  hasVideo = true
                  if (match.index > lastIndex) {
                    const textBefore = child.slice(lastIndex, match.index)
                    if (textBefore.trim()) {
                      processedChildren.push(<span key={`${index}-text-${lastIndex}`}>{textBefore}</span>)
                    }
                  }
                  
                  const videoId = extractYouTubeId(match[0])
                  if (videoId) {
                    processedChildren.push(<YouTubeEmbed key={`${index}-video-${match.index}`} videoId={videoId} />)
                  }
                  
                  lastIndex = youtubeRegex.lastIndex
                }
                
                if (lastIndex < child.length) {
                  const textAfter = child.slice(lastIndex)
                  if (textAfter.trim()) {
                    processedChildren.push(<span key={`${index}-text-${lastIndex}`}>{textAfter}</span>)
                  }
                }
                
                if (!hasVideo) {
                  processedChildren.push(<span key={index}>{child}</span>)
                }
              } else {
                processedChildren.push(child)
              }
            })
            
            if (processedChildren.some(child => React.isValidElement(child) && child.type === YouTubeEmbed)) {
              return <div className="leading-7 mb-6 [&:not(:first-child)]:mt-6 text-foreground space-y-4">{processedChildren}</div>
            }
            
            return (
              <p className="leading-7 mb-6 [&:not(:first-child)]:mt-6 text-foreground">
                {children}
              </p>
            )
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
