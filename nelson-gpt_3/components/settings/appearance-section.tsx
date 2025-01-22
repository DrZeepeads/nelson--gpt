'use client'

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSettings } from "@/hooks/use-settings"
import { type Theme, type FontSize } from "@/types/settings"

export function AppearanceSection() {
  const { theme, fontSize, updateSettings } = useSettings()

  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold">Appearance</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Theme</Label>
          <Select
            value={theme}
            onValueChange={(value: Theme) => updateSettings({ theme: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="light">Light</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Font Size</Label>
          <Select
            value={fontSize}
            onValueChange={(value: FontSize) => updateSettings({ fontSize: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select font size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  )
}

