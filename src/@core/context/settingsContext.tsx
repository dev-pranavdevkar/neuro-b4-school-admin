// ** React Imports
import { createContext, useState, ReactNode, useEffect } from 'react'
import { Direction } from '@mui/material'
import themeConfig from 'src/configs/themeConfig'
import { Skin, Mode, AppBar, Footer, ThemeColor, ContentWidth, VerticalNavToggle } from 'src/@core/layouts/types'

export type Settings = {
  skin: Skin
  mode: Mode
  appBar?: AppBar
  footer?: Footer
  navHidden?: boolean
  appBarBlur: boolean
  direction: Direction
  navCollapsed: boolean
  themeColor: ThemeColor
  contentWidth: ContentWidth
  layout?: 'vertical' | 'horizontal'
  lastLayout?: 'vertical' | 'horizontal'
  verticalNavToggleType: VerticalNavToggle
  toastPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
}

export type PageSpecificSettings = Partial<Settings>; // Change type to Partial<Settings>

export type SettingsContextValue = {
  settings: Settings
  saveSettings: (updatedSettings: Settings) => void
}

interface SettingsProviderProps {
  children: ReactNode
  pageSettings?: PageSpecificSettings // Change to PageSpecificSettings
}

const initialSettings: Settings = {
  themeColor: 'primary',
  mode: themeConfig.mode,
  skin: themeConfig.skin,
  footer: themeConfig.footer,
  layout: themeConfig.layout,
  lastLayout: themeConfig.layout,
  direction: themeConfig.direction,
  navHidden: themeConfig.navHidden,
  appBarBlur: themeConfig.appBarBlur,
  navCollapsed: themeConfig.navCollapsed,
  contentWidth: themeConfig.contentWidth,
  toastPosition: themeConfig.toastPosition,
  verticalNavToggleType: themeConfig.verticalNavToggleType,
  appBar: themeConfig.layout === 'horizontal' && themeConfig.appBar === 'hidden' ? 'fixed' : themeConfig.appBar
}

// Remove unnecessary staticSettings and restoreSettings functions

// ** Create Context
export const SettingsContext = createContext<SettingsContextValue>({
  saveSettings: () => null,
  settings: initialSettings
})

export const SettingsProvider = ({ children, pageSettings }: SettingsProviderProps) => {
  // ** State
  const [settings, setSettings] = useState<Settings>({ ...initialSettings })

  useEffect(() => {
    const restoredSettings = localStorage.getItem('settings'); // Remove restoreSettings function

    if (restoredSettings) {
      setSettings({ ...JSON.parse(restoredSettings), ...initialSettings }); // Merge with initialSettings
    }
    if (pageSettings) {
      setSettings({ ...settings, ...pageSettings })
    }

  }, [pageSettings])

  useEffect(() => {
    if (settings.layout === 'horizontal' && settings.mode === 'semi-dark') {
      saveSettings({ ...settings, mode: 'light' })
    }
    if (settings.layout === 'horizontal' && settings.appBar === 'hidden') {
      saveSettings({ ...settings, appBar: 'fixed' })
    }

  }, [settings.layout])

  const saveSettings = (updatedSettings: Settings) => {
    localStorage.setItem('settings', JSON.stringify(updatedSettings)); // Store settings directly
    setSettings(updatedSettings)
  }

  return <SettingsContext.Provider value={{ settings, saveSettings }}>{children}</SettingsContext.Provider>
}

export const SettingsConsumer = SettingsContext.Consumer
