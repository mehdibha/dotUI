'use client'

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import type { PanelConfig } from './types'

export const DEFAULT_PANEL_CONFIG: PanelConfig = {
  layout: 'scroll',
  grouping: 'domain',
  density: 'comfortable',
  rowLayout: 'stacked',
  showDescriptions: true,
  showMacros: true,
  advanced: true,
  width: 340,
  dockSide: 'left',
  stickyFooter: true,
  header: {
    showBrand: true,
    showName: true,
    showMode: true,
    showSearch: true,
    showReroll: true,
    tall: false,
    sticky: true,
  },
}

const STORAGE_KEY = 'dotui:panel-lab-config'

interface PanelConfigContextValue {
  config: PanelConfig
  setConfig: (next: Partial<PanelConfig>) => void
  setHeader: (next: Partial<PanelConfig['header']>) => void
  reset: () => void
}

const PanelConfigContext = createContext<PanelConfigContextValue | null>(null)

function readStored(): PanelConfig {
  if (typeof window === 'undefined') return DEFAULT_PANEL_CONFIG
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PANEL_CONFIG
    const parsed = JSON.parse(raw) as Partial<PanelConfig>
    // Merge over defaults so new keys added later don't break a stored blob.
    return {
      ...DEFAULT_PANEL_CONFIG,
      ...parsed,
      header: { ...DEFAULT_PANEL_CONFIG.header, ...parsed.header },
    }
  } catch {
    return DEFAULT_PANEL_CONFIG
  }
}

export function PanelConfigProvider({ children }: { children: ReactNode }) {
  // Seed from defaults on the server, hydrate from storage after mount so SSR
  // and first client render agree (the builder route is client-heavy anyway).
  const [config, setState] = useState<PanelConfig>(DEFAULT_PANEL_CONFIG)

  useEffect(() => {
    setState(readStored())
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  }, [config])

  const setConfig = useCallback((next: Partial<PanelConfig>) => {
    setState((prev) => ({ ...prev, ...next }))
  }, [])

  const setHeader = useCallback((next: Partial<PanelConfig['header']>) => {
    setState((prev) => ({ ...prev, header: { ...prev.header, ...next } }))
  }, [])

  const reset = useCallback(() => setState(DEFAULT_PANEL_CONFIG), [])

  const value = useMemo(
    () => ({ config, setConfig, setHeader, reset }),
    [config, setConfig, setHeader, reset],
  )

  return (
    <PanelConfigContext.Provider value={value}>
      {children}
    </PanelConfigContext.Provider>
  )
}

export function usePanelConfig() {
  const ctx = useContext(PanelConfigContext)
  if (!ctx) {
    throw new Error('usePanelConfig must be used within a PanelConfigProvider')
  }
  return ctx
}
