"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Edit, FileText } from "lucide-react"

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
}

export function MarkdownEditor({ value, onChange, placeholder = "Enter markdown content...", height = 400 }: MarkdownEditorProps) {
  const [mode, setMode] = useState<"edit" | "preview" | "raw">("edit")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Project Page Content
          </CardTitle>
          <Tabs value={mode} onValueChange={(v) => setMode(v as "edit" | "preview" | "raw")} className="w-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="edit" className="flex items-center gap-1">
                <Edit className="h-3 w-3" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="raw" className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Raw
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {mode === "edit" && (
          <div data-color-mode="auto">
            <MDEditor
              value={value}
              onChange={(val) => onChange(val || "")}
              height={height}
              preview="edit"
              hideToolbar={false}
              textareaProps={{
                placeholder,
                style: {
                  fontSize: 14,
                  backgroundColor: "transparent",
                  fontFamily: "ui-monospace, SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace"
                }
              }}
            />
          </div>
        )}
        
        {mode === "preview" && (
          <div data-color-mode="auto">
            <MDEditor
              value={value}
              onChange={() => {}}
              height={height}
              preview="preview"
              hideToolbar
            />
          </div>
        )}
        
        {mode === "raw" && (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-96 p-4 bg-background border border-border rounded-md font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
            style={{ minHeight: height }}
          />
        )}
      </CardContent>
    </Card>
  )
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

  return (
    <div data-color-mode="auto">
      <MarkdownPreview 
        source={content} 
        style={{ 
          backgroundColor: "transparent",
          color: "inherit"
        }}
      />
    </div>
  )
}
