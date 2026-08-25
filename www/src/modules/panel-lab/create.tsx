"use client"

/* The lab panel mounted in /create's slot. The chrome (switcher, reset,
   search, save, export) is wired to the real create engine here; chapter axes
   stay lab-local until each chapter is wired in turn. */

import { useState } from "react"

import { cn } from "@/registry/lib/utils"
import { ExportDialog } from "@/modules/create/export"
import {
  decodePreset,
  DEFAULTS as ENGINE_DEFAULTS,
  encodePreset,
  useDesignSystem,
  useMyPresets,
} from "@/modules/create/preset"
import {
  DEFAULT_DESIGN_SYSTEM_NAME,
  saveDesignSystemName,
  useDesignSystemName,
} from "@/modules/create/preset/storage"
import { SavePresetDialog } from "@/modules/create/save-preset-dialog"

import type { PanelSystem } from "./panel"
import { CHAPTERS } from "./state"
import { useLab } from "./use-lab"
import { PanelB } from "./variants/panel-b"

export function LabCreatePanel({ className }: { className?: string }) {
  const lab = useLab()
  const { designSystem, setDesignSystem } = useDesignSystem()
  const { presets, activeId, setActive } = useMyPresets()
  const name = useDesignSystemName()
  const [saveOpen, setSaveOpen] = useState(false)

  const system: PanelSystem = {
    name,
    systems: presets.map((p) => ({ id: p.id, name: p.name })),
    activeId,
    // encodePreset returns undefined when everything matches the defaults.
    modified: encodePreset(designSystem) !== undefined,
    onSelect: (id) => {
      const saved = presets.find((p) => p.id === id)
      if (!saved) return
      setDesignSystem(decodePreset(saved.state))
      setActive(id)
      saveDesignSystemName(saved.name)
    },
    onNew: () => {
      setDesignSystem(ENGINE_DEFAULTS)
      setActive(undefined)
      saveDesignSystemName(DEFAULT_DESIGN_SYSTEM_NAME)
    },
    onReset: () => setDesignSystem(ENGINE_DEFAULTS),
    onSave: () => setSaveOpen(true),
    renderExport: (trigger) => <ExportDialog>{trigger}</ExportDialog>,
  }

  return (
    <div
      className={cn(
        "relative flex w-full flex-1 flex-col lg:w-76 lg:flex-none lg:shrink-0",
        className,
      )}
    >
      <PanelB chapters={CHAPTERS} lab={lab} system={system} />
      <SavePresetDialog isOpen={saveOpen} onOpenChange={setSaveOpen} />
    </div>
  )
}
