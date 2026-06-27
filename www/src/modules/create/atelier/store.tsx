'use client'

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { getRouteApi } from '@tanstack/react-router'

import { DEFAULTS, useDesignSystem } from '../preset'
import { type ChangeSet, interpret } from './ai/engine'

/* ----------------------------------------------------------------------------
 * Studio UI state. The *design* state still lives in `useDesignSystem` (URL-
 * encoded); this context owns only the editor's own UI: which domain is open,
 * what the stage shows, and the AI conversation. Keeping the two apart means a
 * shared `?preset=` link restores the system without dragging editor chrome.
 * -------------------------------------------------------------------------- */

export type StageView = 'preview' | 'spec'

export type AiMessage =
  | { kind: 'user'; id: string; text: string }
  | {
      kind: 'proposal'
      id: string
      changeSet: ChangeSet
      status: 'pending' | 'applied' | 'dismissed'
    }

interface StudioContextValue {
  activeDomain: string
  setActiveDomain: (id: string) => void

  stageView: StageView
  setStageView: (v: StageView) => void

  aiOpen: boolean
  setAiOpen: (open: boolean) => void

  messages: AiMessage[]
  submitPrompt: (text: string) => void
  /** Push a pre-built proposal (e.g. from reference extraction) into the chat. */
  proposeChangeSet: (changeSet: ChangeSet, userText?: string) => void
  applyChangeSet: (changeSet: ChangeSet, messageId?: string) => void
  dismissProposal: (messageId: string) => void
  clearConversation: () => void

  canUndo: boolean
  undo: () => void
  reset: () => void
}

const StudioContext = createContext<StudioContextValue | null>(null)
const routeApi = getRouteApi('/_app/create')

export function StudioProvider({ children }: { children: ReactNode }) {
  const { preset } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const { designSystem, setDesignSystem } = useDesignSystem()

  const [activeDomain, setActiveDomain] = useState('color')
  const [stageView, setStageView] = useState<StageView>('preview')
  const [aiOpen, setAiOpen] = useState(false)
  const [messages, setMessages] = useState<AiMessage[]>([])

  /* Undo — mirrors the shipped customizer: every edit replaces `?preset=`, so
     the browser back button can't step through them. Watch `preset` and keep our
     own stack. AI "apply" lands as one preset change, so it's one undo step. */
  const historyRef = useRef<(string | undefined)[]>([])
  const prevPresetRef = useRef<string | undefined>(preset)
  const isUndoingRef = useRef(false)
  const [canUndo, setCanUndo] = useState(false)

  useEffect(() => {
    if (prevPresetRef.current === preset) return
    if (isUndoingRef.current) {
      isUndoingRef.current = false
    } else {
      historyRef.current.push(prevPresetRef.current)
      setCanUndo(true)
    }
    prevPresetRef.current = preset
  }, [preset])

  const undo = useCallback(() => {
    if (historyRef.current.length === 0) return
    const previous = historyRef.current.pop()
    isUndoingRef.current = true
    navigate({
      search: (prev) => ({ ...prev, preset: previous }),
      replace: true,
    })
    setCanUndo(historyRef.current.length > 0)
  }, [navigate])

  const reset = useCallback(() => setDesignSystem(DEFAULTS), [setDesignSystem])

  const proposeChangeSet = useCallback(
    (changeSet: ChangeSet, userText?: string) => {
      setMessages((prev) => [
        ...prev,
        ...(userText
          ? [{ kind: 'user' as const, id: `u-${changeSet.id}`, text: userText }]
          : []),
        {
          kind: 'proposal',
          id: `p-${changeSet.id}`,
          changeSet,
          status: 'pending',
        },
      ])
      setAiOpen(true)
    },
    [],
  )

  const submitPrompt = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return
      proposeChangeSet(interpret(trimmed, designSystem), trimmed)
    },
    [designSystem, proposeChangeSet],
  )

  const applyChangeSet = useCallback(
    (changeSet: ChangeSet, messageId?: string) => {
      setDesignSystem(changeSet.apply)
      if (messageId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.kind === 'proposal' && m.id === messageId
              ? { ...m, status: 'applied' }
              : m,
          ),
        )
      }
    },
    [setDesignSystem],
  )

  const dismissProposal = useCallback((messageId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.kind === 'proposal' && m.id === messageId
          ? { ...m, status: 'dismissed' }
          : m,
      ),
    )
  }, [])

  const clearConversation = useCallback(() => setMessages([]), [])

  const value = useMemo(
    () => ({
      activeDomain,
      setActiveDomain,
      stageView,
      setStageView,
      aiOpen,
      setAiOpen,
      messages,
      submitPrompt,
      proposeChangeSet,
      applyChangeSet,
      dismissProposal,
      clearConversation,
      canUndo,
      undo,
      reset,
    }),
    [
      activeDomain,
      stageView,
      aiOpen,
      messages,
      submitPrompt,
      proposeChangeSet,
      applyChangeSet,
      dismissProposal,
      clearConversation,
      canUndo,
      undo,
      reset,
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
