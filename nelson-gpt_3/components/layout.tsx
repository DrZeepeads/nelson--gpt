"use client"

import { useState, useEffect } from "react"
import { Menu, Plus, Settings, X, Wifi, WifiOff, BarChart2, Pill } from "lucide-react"
import { cn } from "@/lib/utils"
import { AppearanceSection } from "@/components/settings/appearance-section"
import { BehaviorSection } from "@/components/settings/behavior-section"
import { AISettingsSection } from "@/components/settings/ai-settings-section"
import { DataPrivacySection } from "@/components/settings/data-privacy-section"
import { ChatList } from "@/components/chat-list"
import { Chat } from "@/components/chat"
import { ChatInput } from "@/components/chat-input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useChats } from "@/hooks/use-chats"
import { useTheme } from "@/hooks/use-theme"
import { useSettings } from "@/hooks/use-settings"
import { ToastProvider } from "@/components/ui/toast"
import { InstallPWA } from "@/components/install-pwa"
import { GrowthChartViewer } from "@/components/growth-chart-viewer"
import { motion, AnimatePresence } from "framer-motion"
import { DrugCalculator } from "@/components/drug-calculator"

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isGrowthChartOpen, setIsGrowthChartOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [isDrugCalculatorOpen, setIsDrugCalculatorOpen] = useState(false)
  const { createChat } = useChats()
  const { updateSettings } = useSettings()

  // Initialize theme
  useTheme()

  // Initialize Mistral API key
  useEffect(() => {
    updateSettings({
      apiKeys: {
        mistral: "clkU70jpgcejg8ejWcYt3UidmLpFPJxK",
      },
    })
  }, [updateSettings])

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSettingsOpen(false)
        setIsSidebarOpen(false)
        setIsGrowthChartOpen(false)
        setIsDrugCalculatorOpen(false)
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [])

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission()
    }
  }, [])

  return (
    <ToastProvider>
      <div className="h-screen bg-background text-foreground flex">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-64 bg-background border-r border-border z-40"
            >
              <div className="flex flex-col h-full p-2">
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 mb-2"
                  onClick={() => {
                    createChat()
                    setIsSidebarOpen(false)
                  }}
                >
                  <Plus className="h-5 w-5" />
                  <span>New chat</span>
                </Button>

                <ChatList />

                <Separator className="my-2" />

                <Button
                  variant="ghost"
                  className="flex items-center space-x-2"
                  onClick={() => {
                    setIsSettingsOpen(true)
                    setIsSidebarOpen(false)
                  }}
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full">
          {/* Header */}
          <header className="h-14 border-b border-border flex items-center justify-between px-4">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              {isOnline ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
              <Button variant="ghost" size="icon" onClick={() => setIsGrowthChartOpen(!isGrowthChartOpen)}>
                <BarChart2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsDrugCalculatorOpen(!isDrugCalculatorOpen)}>
                <Pill className="h-5 w-5" />
              </Button>
              <InstallPWA />
            </div>
          </header>

          {/* Chat Area */}
          <Chat />

          {/* Input Area */}
          <ChatInput />
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-background border-l border-border p-6 overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Settings</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <AppearanceSection />
                  <Separator />
                  <BehaviorSection />
                  <Separator />
                  <AISettingsSection />
                  <Separator />
                  <DataPrivacySection />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Growth Chart Viewer */}
        <AnimatePresence>
          {isGrowthChartOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-x-0 bottom-0 h-[80vh] bg-background border-t border-border p-6 overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Pediatric Growth Charts</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsGrowthChartOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <GrowthChartViewer />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drug Calculator */}
        <AnimatePresence>
          {isDrugCalculatorOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-x-0 bottom-0 h-[80vh] bg-background border-t border-border p-6 overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Pediatric Drug Calculator</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsDrugCalculatorOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <DrugCalculator />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastProvider>
  )
}

