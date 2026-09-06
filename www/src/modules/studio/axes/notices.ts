/* Notices — how the system announces events: the toast and the inline
   alert. Both answer "how much intent color does a notice surface carry?"
   but stay two axes: Ant pairs tinted alerts with neutral toasts and
   Material an inverse snackbar with neutral banners. Synced, either row
   drags the other to its nearest counterpart (the Button ⇄ ToggleButton
   model); unlinked, they fork.

   Engine: `style` and `position` are enum params on `toast`, `style` on
   `alert`. Position lands as the tv default the provider reads, so the
   exported component opens where the studio said. */

import type { Resolved, StudioState } from "./index"

export const NOTICE_DEFAULTS = {
  noticeToast: "surface",
  noticeToastPosition: "bottom-right",
  noticeAlert: "neutral",
  noticeSynced: true,
}

export const TOAST_OPTIONS = [
  { value: "surface", label: "Surface" },
  { value: "inverted", label: "Inverted" },
  { value: "filled", label: "Filled" },
  { value: "accent-bar", label: "Accent bar" },
]

export const POSITION_OPTIONS = [
  { value: "top-left", label: "Top left" },
  { value: "top-center", label: "Top center" },
  { value: "top-right", label: "Top right" },
  { value: "bottom-left", label: "Bottom left" },
  { value: "bottom-center", label: "Bottom center" },
  { value: "bottom-right", label: "Bottom right" },
]

export const ALERT_OPTIONS = [
  { value: "neutral", label: "Neutral" },
  { value: "tinted", label: "Tinted" },
  { value: "tinted-border", label: "Tinted border" },
  { value: "accent-bar", label: "Accent bar" },
]

/* Nearest counterpart, not identity: the vocabularies only partly overlap
   (no inverted alert exists in the wild, no tinted toast). */
const TOAST_TO_ALERT: Record<string, string> = {
  surface: "neutral",
  inverted: "neutral",
  filled: "tinted",
  "accent-bar": "accent-bar",
}
const ALERT_TO_TOAST: Record<string, string> = {
  neutral: "surface",
  tinted: "filled",
  "tinted-border": "surface",
  "accent-bar": "accent-bar",
}

export const syncedAlert = (toast: string) => TOAST_TO_ALERT[toast] ?? "neutral"
export const syncedToast = (alert: string) => ALERT_TO_TOAST[alert] ?? "surface"

const pick = (options: { value: string }[], value: string, fallback: string) =>
  options.some((o) => o.value === value) ? value : fallback

export function resolveNotices(state: StudioState): Resolved {
  return {
    params: {
      toast: {
        style: pick(TOAST_OPTIONS, state.noticeToast, "surface"),
        position: pick(
          POSITION_OPTIONS,
          state.noticeToastPosition,
          "bottom-right",
        ),
      },
      alert: { style: pick(ALERT_OPTIONS, state.noticeAlert, "neutral") },
    },
  }
}
