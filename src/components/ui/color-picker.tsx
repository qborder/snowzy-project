"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EnhancedInput } from "@/components/ui/enhanced-input"
import { Palette, Plus, X } from "lucide-react"

interface ColorPickerProps {
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export function ColorPicker({ value = "#3b82f6", onChange, className }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempColor, setTempColor] = useState(value)

  const handleColorChange = (color: string) => {
    setTempColor(color)
    onChange?.(color)
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-lg border-2 border-border hover:border-primary transition-colors"
          style={{ backgroundColor: value }}
        />
        <EnhancedInput
          value={value}
          onChange={e => handleColorChange(e.target.value)}
          placeholder="#3b82f6"
          className="flex-1"
        />
      </div>
      
      {isOpen && (
        <Card className="absolute z-10 mt-2 w-64">
          <CardContent className="p-4">
            <div className="space-y-3">
              <input
                type="color"
                value={tempColor}
                onChange={e => handleColorChange(e.target.value)}
                className="w-full h-20 rounded-lg border-0 cursor-pointer"
              />
              
              <div className="grid grid-cols-8 gap-1">
                {[
                  "#ef4444", "#f97316", "#f59e0b", "#eab308",
                  "#84cc16", "#22c55e", "#10b981", "#14b8a6",
                  "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1",
                  "#8b5cf6", "#a855f7", "#d946ef", "#ec4899",
                  "#f43f5e", "#64748b", "#374151", "#111827"
                ].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorChange(color)}
                    className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="w-full"
              >
                Done
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
