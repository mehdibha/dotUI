'use client'

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useDesignSystem } from '../preset'
import { interpretChat, interpretPrompt } from './ai/interpret'
import { type Vibe, vibeToMutate } from './ai/vibes'

/* ----------------------------------------------------------------------------
 * One provider for the whole Studio: which section is open, the editable system
 * name, and the AI thread + apply logic. Centralising the AI here lets the
 * generate panel, the canvas command bar, the copilot and the inline
 * "Fix with AI" buttons all share one conversation and one apply path.
 * -------------------------------------------------------------------------- */

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  changes?: string[]
  /** true while the assistant is "thinking". */
  pending?: boolean
}

export interface AppliedFlash {
  id: string
  title: string
  changes: string[]
}

interface StudioContextValue {
  activeSection: string
  setActiveSection: (id: string) => void
  name: string
  setName: (name: string) => void

  thread: ChatMessage[]
  isThinking: boolean
  /** The most recent applied change — drives the transient canvas flash. */
  flash: AppliedFlash | null
  clearFlash: () => void

  /** Conversational tweak (copilot + canvas command bar). */
  send: (text: string) => void
  /** From-scratch generation (the Generate panel prompt). */
  generate: (text: string) => void
  /** Apply a named vibe directly (chip click). */
  applyVibe: (vibe: Vibe) => void
}

const StudioContext = createContext<StudioContextValue | null>(null)

let counter = 0
const uid = (prefix: string) => `${prefix}-${++counter}-${Date.now()}`

const THINK_MS = 650

export function StudioProvider({ children }: { children: ReactNode }) {
  const { designSystem, setDesignSystem } = useDesignSystem()
  const designSystemRef = useRef(designSystem)
  designSystemRef.current = designSystem

  const [activeSection, setActiveSection] = useState('generate')
  const [name, setName] = useState('Untitled system')
  const [thread, setThread] = useState<ChatMessage[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [flash, setFlash] = useState<AppliedFlash | null>(null)

  const clearFlash = useCallback(() => setFlash(null), [])

  // Shared apply path: push the user line + a pending assistant line, then after a
  // short "thinking" beat run the interpreter, apply the mutation to the live
  // system, and resolve the assistant line with the human-readable changes.
  const run = useCallback(
    (
      text: string,
      interpret: (t: string) => ReturnType<typeof interpretChat>,
    ) => {
      const userId = uid('u')
      const botId = uid('a')
      setThread((t) => [
        ...t,
        { id: userId, role: 'user', text },
        { id: botId, role: 'assistant', text: '', pending: true },
      ])
      setIsThinking(true)

      window.setTimeout(() => {
        const result = interpret(text)
        if (result) {
          setDesignSystem(result.mutate)
          setThread((t) =>
            t.map((m) =>
              m.id === botId
                ? {
                    ...m,
                    pending: false,
                    text: result.title,
                    changes: result.changes,
                  }
                : m,
            ),
          )
          setFlash({ id: botId, title: result.title, changes: result.changes })
        } else {
          setThread((t) =>
            t.map((m) =>
              m.id === botId
                ? {
                    ...m,
                    pending: false,
                    text: "I couldn't map that to a change yet — try “rounder”, “calmer accent”, “increase contrast”, or a vibe like “Linear”.",
                  }
                : m,
            ),
          )
        }
        setIsThinking(false)
      }, THINK_MS)
    },
    [setDesignSystem],
  )

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return
      run(trimmed, (t) => interpretChat(t, designSystemRef.current))
    },
    [run],
  )

  const generate = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return
      run(trimmed, (t) => interpretPrompt(t))
    },
    [run],
  )

  const applyVibe = useCallback(
    (vibe: Vibe) => {
      setDesignSystem(vibeToMutate(vibe))
      const changes = [
        `Accent → ${vibe.accent}`,
        `Radius → ${Number.parseFloat(vibe.radius).toFixed(1)}×`,
        `Density → ${vibe.density}`,
      ]
      setThread((t) => [
        ...t,
        { id: uid('u'), role: 'user', text: `Apply the ${vibe.label} vibe` },
        {
          id: uid('a'),
          role: 'assistant',
          text: `${vibe.label} — ${vibe.summary}`,
          changes,
        },
      ])
      setFlash({ id: uid('f'), title: vibe.label, changes })
    },
    [setDesignSystem],
  )

  const value = useMemo<StudioContextValue>(
    () => ({
      activeSection,
      setActiveSection,
      name,
      setName,
      thread,
      isThinking,
      flash,
      clearFlash,
      send,
      generate,
      applyVibe,
    }),
    [
      activeSection,
      name,
      thread,
      isThinking,
      flash,
      clearFlash,
      send,
      generate,
      applyVibe,
    ],
  )

  return (
    <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
  )
}

export function useStudio(): StudioContextValue {
  const ctx = useContext(StudioContext)
  if (!ctx) throw new Error('useStudio must be used within StudioProvider')
  return ctx
}
