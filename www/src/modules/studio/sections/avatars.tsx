"use client"

/* Avatars — circle for people, the rounded square for entities; initials on
   one gray or a per-entity tint. */

import { cn } from "@/registry/lib/utils"

import { FALLBACK_OPTIONS, SHAPE_OPTIONS } from "../axes/avatars"
import { DialGap, DialList, DialSegmented } from "../dial"
import type { Studio, StudioState } from "../state"

function AvatarGlyph({
  shape,
  fallback,
  large,
}: {
  shape: string
  fallback: string
  large?: boolean
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center font-semibold",
        large ? "size-6 text-[9px]" : "size-4 text-[7px]",
        shape === "circle"
          ? "rounded-full"
          : large
            ? "rounded-[7px]"
            : "rounded-[5px]",
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
      <DialList
        label="Shape"
        value={state.avatarShape}
        onChange={set("avatarShape")}
        options={SHAPE_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <AvatarGlyph
              shape={option.value}
              fallback={state.avatarFallback}
              large
            />
          ),
        }))}
      />
      <DialGap />
      <DialSegmented
        label="Fallback"
        value={state.avatarFallback}
        onChange={set("avatarFallback")}
        options={FALLBACK_OPTIONS}
      />
    </>
  )
}
