'use client'

import { type ComponentType, useEffect, useRef } from 'react'
import {
  BoxesIcon,
  type LucideIcon,
  LayersIcon,
  MousePointer2Icon,
  PaletteIcon,
  RotateCcwIcon,
  RulerIcon,
  ShapesIcon,
  SmileIcon,
  SparklesIcon,
  TypeIcon,
  ZapIcon,
} from 'lucide-react'
import { motion } from 'motion/react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { useDesignSystem } from '../../preset'
import { useStudio } from '../context'
import type { WorkspaceId } from '../context'
import { isWorkspaceDirty, useResetWorkspace } from '../divergence'
import { ColorWorkspace } from './color'
import { ComponentsWorkspace } from './components'
import {
  IconsWorkspace,
  InteractionWorkspace,
  MotionWorkspace,
  ShapeWorkspace,
  SpacingWorkspace,
  SurfaceWorkspace,
  TypographyWorkspace,
} from './foundations'
import { StartWorkspace } from './start'

export interface WorkspaceMeta {
  id: WorkspaceId
  label: string
  icon: LucideIcon
  /** A visual break is drawn before this rail item. */
  groupStart?: boolean
  Component: ComponentType
}

export const WORKSPACES: WorkspaceMeta[] = [
  {
    id: 'start',
    label: 'Start',
    icon: SparklesIcon,
    Component: StartWorkspace,
  },
  {
    id: 'color',
    label: 'Color',
    icon: PaletteIcon,
    groupStart: true,
    Component: ColorWorkspace,
  },
  {
    id: 'typography',
    label: 'Typography',
    icon: TypeIcon,
    Component: TypographyWorkspace,
  },
  { id: 'shape', label: 'Shape', icon: ShapesIcon, Component: ShapeWorkspace },
  {
    id: 'spacing',
    label: 'Spacing & density',
    icon: RulerIcon,
    Component: SpacingWorkspace,
  },
  {
    id: 'surface',
    label: 'Surface & elevation',
    icon: LayersIcon,
    Component: SurfaceWorkspace,
  },
  { id: 'motion', label: 'Motion', icon: ZapIcon, Component: MotionWorkspace },
  {
    id: 'icons',
    label: 'Iconography',
    icon: SmileIcon,
    Component: IconsWorkspace,
  },
  {
    id: 'interaction',
    label: 'Interaction',
    icon: MousePointer2Icon,
    Component: InteractionWorkspace,
  },
  {
    id: 'components',
    label: 'Components',
    icon: BoxesIcon,
    groupStart: true,
    Component: ComponentsWorkspace,
  },
]

const BY_ID = new Map(WORKSPACES.map((w) => [w.id, w]))

/** Renders the active workspace and scrolls to a deep-linked control anchor. */
export function ActiveWorkspace() {
  const { workspace, focus, clearFocus } = useStudio()
  const { designSystem } = useDesignSystem()
  const resetWorkspace = useResetWorkspace()
  const ref = useRef<HTMLDivElement>(null)
  const meta = BY_ID.get(workspace) ?? WORKSPACES[0]

  useEffect(() => {
    if (!focus) return
    // Wait a frame so the freshly-keyed workspace has mounted its anchors.
    const raf = requestAnimationFrame(() => {
      const node = ref.current?.querySelector<HTMLElement>(
        `[data-anchor="${focus}"]`,
      )
      if (node) {
        node.scrollIntoView({ behavior: 'smooth', block: 'center' })
        node.animate(
          [
            { boxShadow: '0 0 0 2px var(--color-primary)' },
            { boxShadow: '0 0 0 2px transparent' },
          ],
          { duration: 1200, easing: 'ease-out' },
        )
      }
      clearFocus()
    })
    return () => cancelAnimationFrame(raf)
    // Re-run when the deep-link target changes; the workspace already switched.
  }, [focus, workspace, clearFocus])

  if (!meta) return null
  const Active = meta.Component
  const dirty =
    workspace !== 'start' && isWorkspaceDirty(designSystem, workspace)

  return (
    <div className="relative">
      {dirty && (
        <ButtonPrimitives.Button
          onPress={() => resetWorkspace(workspace)}
          className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1 rounded-full border bg-card/80 px-2 py-1 text-[11px] text-fg-muted focus-reset backdrop-blur-sm transition-colors hover:bg-neutral hover:text-fg focus-visible:focus-ring"
        >
          <RotateCcwIcon className="size-3" />
          Reset
        </ButtonPrimitives.Button>
      )}
      {/* Enter-only transition: the keyed div remounts per workspace and fades
          in. No AnimatePresence/exit — a wait-mode exit can strand the pane blank
          under rapid switching. */}
      <motion.div
        key={workspace}
        ref={ref}
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
        className="p-4"
      >
        <Active />
      </motion.div>
    </div>
  )
}
