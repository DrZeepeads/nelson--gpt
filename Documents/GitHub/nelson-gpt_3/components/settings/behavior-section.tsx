'use client'

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSettings } from "@/hooks/use-settings"
import { type Language } from "@/types/settings"
import { subscribeToPushNotifications } from "@/lib/push-notifications"

export function BehaviorSection() {
  const {
    language,
    soundNotifications,
    autoScroll,
    enterToSend,
    pushNotifications,
    updateSettings
  } = useSettings()

  const handlePushNotificationChange = async (checked: boolean) => {
    if (checked) {
      await subscribeToPushNotifications();
    }
    updateSettings({ pushNotifications: checked });
  }

  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold">Behavior</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Language</Label>
          <Select
            value={language}
            onValueChange={(value: Language) => updateSettings({ language: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="German">German</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="soundNotifications">Enable sound notifications</Label>
          <Switch
            id="soundNotifications"
            checked={soundNotifications}
            onCheckedChange={(checked) => updateSettings({ soundNotifications: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="pushNotifications">Enable push notifications</Label>
          <Switch
            id="pushNotifications"
            checked={pushNotifications}
            onCheckedChange={handlePushNotificationChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="autoScroll">Auto-scroll to new messages</Label>
          <Switch
            id="autoScroll"
            checked={autoScroll}
            onCheckedChange={(checked) => updateSettings({ autoScroll: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="enterToSend">Press Enter to send message</Label>
          <Switch
            id="enterToSend"
            checked={enterToSend}
            onCheckedChange={(checked) => updateSettings({ enterToSend: checked })}
          />
        </div>
      </div>
    </section>
  )
}

