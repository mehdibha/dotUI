'use client'

import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'

import type { AxisId } from './axes'

/* ----------------------------------------------------------------------------
 * Studio UI state — ephemeral view state only (which axis is open, which
 * component is selected, the onboarding gate). The *design system itself* lives
 * in the URL via `useDesignSystem`; this context never touches it. Keeping the
 * two apart means every edit is shareable/persisted while the chrome stays local.
 * -------------------------------------------------------------------------- */

interface StudioContextValue {
  axis: AxisId
  setAxis: (axis: AxisId) => void
  /** The component being tuned in the Components inspector (null = list view). */
  selectedComponent: string | null
  setSelectedComponent: (name: string | null) => void
  onboardingOpen: boolean
  setOnboardingOpen: (open: boolean) => void
  /** Mobile-only: which pane is visible when the two can't sit side by side. */
  mobilePane: 'design' | 'preview'
  setMobilePane: (pane: 'design' | 'preview') => void
}

const StudioContext = createContext<StudioContextValue | null>(null)

export function StudioProvider({
  children,
  initialOnboarding,
}: {
  children: ReactNode
  initialOnboarding: boolean
}) {
  const [axis, setAxis] = useState<AxisId>('color')
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null,
  )
  const [onboardingOpen, setOnboardingOpen] = useState(initialOnboarding)
  const [mobilePane, setMobilePane] = useState<'design' | 'preview'>('design')

  const value = useMemo<StudioContextValue>(
    () => ({
      axis,
      setAxis,
      selectedComponent,
      setSelectedComponent,
      onboardingOpen,
      setOnboardingOpen,
      mobilePane,
      setMobilePane,
    }),
    [axis, selectedComponent, onboardingOpen, mobilePane],
  )

  return (
    <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
  )
}

export function useStudio(): StudioContextValue {
  const ctx = useContext(StudioContext)
  if (!ctx) throw new Error('useStudio must be used within <StudioProvider>')
  return ctx
}
