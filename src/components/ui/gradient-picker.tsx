"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ColorPicker } from "@/components/ui/color-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Palette } from "lucide-react"

interface GradientPickerProps {
  value?: string
  onChange?: (value: string) => void
  className?: string
}

const GRADIENT_DIRECTIONS = [
  { value: "to-r", label: "Left to Right" },
  { value: "to-l", label: "Right to Left" },
  { value: "to-t", label: "Bottom to Top" },
  { value: "to-b", label: "Top to Bottom" },
  { value: "to-tr", label: "Bottom Left to Top Right" },
  { value: "to-tl", label: "Bottom Right to Top Left" },
  { value: "to-br", label: "Top Left to Bottom Right" },
  { value: "to-bl", label: "Top Right to Bottom Left" }
]


export function GradientPicker({ value = "", onChange, className }: GradientPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [direction, setDirection] = useState("to-br")
  const [color1, setColor1] = useState("#3b82f6")
  const [color2, setColor2] = useState("#8b5cf6")
  const [color3, setColor3] = useState("")
  const [useThreeColors, setUseThreeColors] = useState(false)

  const generateGradient = () => {
    const colors = useThreeColors && color3 
      ? `from-[${color1}] via-[${color3}] to-[${color2}]`
      : `from-[${color1}] to-[${color2}]`
    
    const gradientClass = `bg-gradient-${direction} ${colors}`
    onChange?.(gradientClass)
  }

  const applyPresetGradient = (fromColor: string, toColor: string, viaColor?: string) => {
    setColor1(fromColor)
    setColor2(toColor)
    if (viaColor) {
      setColor3(viaColor)
      setUseThreeColors(true)
    } else {
      setUseThreeColors(false)
    }
    
    const colors = viaColor 
      ? `from-[${fromColor}] via-[${viaColor}] to-[${toColor}]`
      : `from-[${fromColor}] to-[${toColor}]`
    
    const gradientClass = `bg-gradient-${direction} ${colors}`
    onChange?.(gradientClass)
  }

  const currentGradient = useThreeColors && color3 
    ? `linear-gradient(${direction.replace('to-', '')}, ${color1}, ${color3}, ${color2})`
    : `linear-gradient(${direction.replace('to-', '')}, ${color1}, ${color2})`

  return (
    <div className={className}>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2"
          >
            <Palette className="h-4 w-4" />
            Custom Gradient
          </Button>
          {value && (
            <div 
              className="w-16 h-8 rounded border"
              style={{ background: currentGradient }}
            />
          )}
        </div>
        
        {isOpen && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">Gradient Builder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Direction</label>
                <Select value={direction} onValueChange={setDirection}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADIENT_DIRECTIONS.map(dir => (
                      <SelectItem key={dir.value} value={dir.value}>
                        {dir.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Start Color</label>
                  <ColorPicker value={color1} onChange={setColor1} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">End Color</label>
                  <ColorPicker value={color2} onChange={setColor2} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="three-colors"
                  checked={useThreeColors}
                  onChange={e => setUseThreeColors(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="three-colors" className="text-sm font-medium">
                  Add middle color
                </label>
              </div>

              {useThreeColors && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Middle Color</label>
                  <ColorPicker value={color3} onChange={setColor3} />
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">Preview</label>
                <div 
                  className="w-full h-20 rounded-lg border"
                  style={{ background: currentGradient }}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Quick Presets</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { from: "#3b82f6", to: "#8b5cf6", name: "Blue Purple" },
                    { from: "#f59e0b", to: "#ef4444", name: "Sunset" },
                    { from: "#10b981", to: "#3b82f6", name: "Ocean" },
                    { from: "#ec4899", to: "#8b5cf6", name: "Pink Purple" },
                    { from: "#06b6d4", to: "#84cc16", name: "Tropical" },
                    { from: "#f97316", to: "#dc2626", name: "Fire" },
                    { from: "#8b5cf6", to: "#ec4899", via: "#f59e0b", name: "Rainbow" },
                    { from: "#1f2937", to: "#374151", name: "Dark" }
                  ].map(preset => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => applyPresetGradient(preset.from, preset.to, preset.via)}
                      className="h-12 rounded-lg border hover:scale-105 transition-transform"
                      style={{ 
                        background: preset.via 
                          ? `linear-gradient(135deg, ${preset.from}, ${preset.via}, ${preset.to})`
                          : `linear-gradient(135deg, ${preset.from}, ${preset.to})`
                      }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={generateGradient} className="flex-1">
                  Apply Gradient
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
