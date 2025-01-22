'use client'

import { useEffect } from 'react'
import { useSettings } from './use-settings'

export function useTheme() {
  const { theme } = useSettings()

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
  }, [theme])
}

