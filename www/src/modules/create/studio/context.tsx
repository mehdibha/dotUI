'use client'

import { createContext, useContext } from 'react'

/**
 * The two authoring postures the whole Studio responds to. `simple` shows only
 * the macro controls in every section (the "clean output in minutes" persona);
 * `pro` reveals every micro knob (the "tweak every detail" persona). It's the
 * single switch that lets one tool serve both audiences without two codebases.
 */
export type StudioMode = 'simple' | 'pro'

export type SectionId =
  | 'brand'
  | 'color'
  | 'typography'
  | 'icons'
  | 'shape'
  | 'density'
  | 'surface'
  | 'motion'
  | 'components'
  | 'code'

export interface StudioContextValue {
  mode: StudioMode
  /** The component currently open in the Components inspector, if any. */
  openComponent: string | null
  /** Open a component's inspector (and switch the live preview to it). */
  setOpenComponent: (name: string | null) => void
  /** Jump the rail to a section — used by search and cross-links. */
  goToSection: (id: SectionId) => void
}

const StudioContext = createContext<StudioContextValue | null>(null)

export function StudioProvider({
  value,
  children,
}: {
  value: StudioContextValue
  children: React.ReactNode
}) {
  return (
    <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
  )
}

export function useStudio(): StudioContextValue {
  const ctx = useContext(StudioContext)
  if (!ctx) throw new Error('useStudio must be used inside <StudioProvider>')
  return ctx
}
