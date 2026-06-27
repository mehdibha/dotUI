'use client'

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { getRouteApi } from '@tanstack/react-router'

import type { DesignSystem } from '../preset'
import { useDesignSystem } from '../preset'
import { interpret } from './ai/engine'

/* ----------------------------------------------------------------------------
 * Studio store — the *UI* state of the new builder shell (which inspector is
 * open, is the copilot docked, inspect mode) plus the AI conversation thread.
 *
 * The design system itself stays in `useDesignSystem` (the URL preset) so the
 * live preview and every existing control keep working untouched. The store
 * only orchestrates: it snapshots the preset before an AI edit so each assistant
 * turn can be undone in one tap.
 * -------------------------------------------------------------------------- */

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  /** Preset value *before* this turn's edit — enables one-tap undo. */
  prevPreset?: string
  /** Whether this assistant turn actually changed the system. */
  changed?: boolean
}

interface StudioContextValue {
  name: string
  setName: (name: string) => void
  activeDomain: string | null
  setActiveDomain: (domain: string | null) => void
  toggleDomain: (domain: string) => void
  copilotOpen: boolean
  setCopilotOpen: (open: boolean) => void
  inspectMode: boolean
  setInspectMode: (on: boolean) => void
  thread: ChatMessage[]
  thinking: boolean
  runPrompt: (prompt: string) => void
  /** Apply a pre-baked change (e.g. a "generate from" result) as a logged, undoable turn. */
  runAction: (
    userText: string,
    assistantText: string,
    mutate: (ds: DesignSystem) => DesignSystem,
  ) => void
  undoTurn: (message: ChatMessage) => void
  clearThread: () => void
}

const StudioContext = createContext<StudioContextValue | null>(null)

const routeApi = getRouteApi('/_app/create')

let counter = 0
const nextId = () => `m${++counter}`

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: "Describe how your system should feel and I'll tune it live — a vibe, a brand color, or a reference like “make it feel like Linear”.",
}

export function StudioProvider({ children }: { children: ReactNode }) {
  const { designSystem, setDesignSystem } = useDesignSystem()
  const { preset } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const [name, setName] = useState('Untitled system')
  const [activeDomain, setActiveDomain] = useState<string | null>('color')
  const [copilotOpen, setCopilotOpen] = useState(true)
  const [inspectMode, setInspectMode] = useState(false)
  const [thread, setThread] = useState<ChatMessage[]>([WELCOME])
  const [thinking, setThinking] = useState(false)

  const toggleDomain = useCallback((domain: string) => {
    setActiveDomain((prev) => (prev === domain ? null : domain))
  }, [])

  const runPrompt = useCallback(
    (prompt: string) => {
      const trimmed = prompt.trim()
      if (!trimmed || thinking) return

      const snapshot = preset
      const userMsg: ChatMessage = {
        id: nextId(),
        role: 'user',
        text: trimmed,
      }
      setThread((t) => [...t, userMsg])
      setThinking(true)

      // A short, deliberate "thinking" beat sells the AI illusion and lets the
      // user read their own message land before the system reshapes.
      const result = interpret(trimmed, designSystem)
      window.setTimeout(() => {
        if (result.actions.length > 0) {
          setDesignSystem((prev: DesignSystem) =>
            result.actions.reduce((acc, action) => action.apply(acc), prev),
          )
        }
        setThread((t) => [
          ...t,
          {
            id: nextId(),
            role: 'assistant',
            text: result.reply,
            prevPreset: result.actions.length > 0 ? snapshot : undefined,
            changed: result.actions.length > 0,
          },
        ])
        setThinking(false)
      }, 480)
    },
    [designSystem, preset, setDesignSystem, thinking],
  )

  const runAction = useCallback(
    (
      userText: string,
      assistantText: string,
      mutate: (ds: DesignSystem) => DesignSystem,
    ) => {
      if (thinking) return
      const snapshot = preset
      setThread((t) => [...t, { id: nextId(), role: 'user', text: userText }])
      setThinking(true)
      window.setTimeout(() => {
        setDesignSystem((prev) => mutate(prev))
        setThread((t) => [
          ...t,
          {
            id: nextId(),
            role: 'assistant',
            text: assistantText,
            prevPreset: snapshot,
            changed: true,
          },
        ])
        setThinking(false)
      }, 480)
    },
    [preset, setDesignSystem, thinking],
  )

  const undoTurn = useCallback(
    (message: ChatMessage) => {
      if (!message.changed) return
      navigate({
        search: (prev) => ({ ...prev, preset: message.prevPreset }),
        replace: true,
      })
      setThread((t) =>
        t.map((m) =>
          m.id === message.id
            ? { ...m, changed: false, text: `${m.text} (reverted)` }
            : m,
        ),
      )
    },
    [navigate],
  )

  const clearThread = useCallback(() => setThread([WELCOME]), [])

  const value = useMemo(
    () => ({
      name,
      setName,
      activeDomain,
      setActiveDomain,
      toggleDomain,
      copilotOpen,
      setCopilotOpen,
      inspectMode,
      setInspectMode,
      thread,
      thinking,
      runPrompt,
      runAction,
      undoTurn,
      clearThread,
    }),
    [
      name,
      activeDomain,
      toggleDomain,
      copilotOpen,
      inspectMode,
      thread,
      thinking,
      runPrompt,
      runAction,
      undoTurn,
      clearThread,
    ],
  )

  return (
    <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
  )
}

export function useStudio() {
  const ctx = useContext(StudioContext)
  if (!ctx) throw new Error('useStudio must be used within a StudioProvider')
  return ctx
}
