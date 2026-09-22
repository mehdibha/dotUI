"use client"

/* Avatars — circle for people, the rounded square for entities; initials on
   one gray or a per-entity tint. */

import { cn } from "@/registry/lib/utils"

import { FALLBACK_OPTIONS, SHAPE_OPTIONS } from "../axes/avatars"
import { DialSegmented } from "../dial"
import type { Studio, StudioState } from "../state"

function AvatarGlyph({ shape, fallback }: { shape: string; fallback: string }) {
  return (
    <span
      className={cn(
        "flex size-4 shrink-0 items-center justify-center text-[7px] font-semibold",
        shape === "circle" ? "rounded-full" : "rounded-[5px]",
        fallback === "tinted"
          ? "bg-accent-muted text-fg-accent"
          : "bg-muted text-fg-muted",
      )}
    >
      AB
    </span>
  )
}

export function AvatarsPreview({ state }: { state: StudioState }) {
  return (
    <AvatarGlyph shape={state.avatarShape} fallback={state.avatarFallback} />
  )
}

export function AvatarsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <>
      <DialSegmented
        label="Shape"
        value={state.avatarShape}
        onChange={set("avatarShape")}
        options={SHAPE_OPTIONS}
      />
      <DialSegmented
        label="Fallback"
        value={state.avatarFallback}
        onChange={set("avatarFallback")}
        options={FALLBACK_OPTIONS}
      />
    </>
  )
}
