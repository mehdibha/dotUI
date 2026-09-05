import type { Resolved, StudioState } from "./index"

export const NOTICE_DEFAULTS = {
  noticeToast: "surface",
  noticeToastPosition: "bottom-right",
  noticeAlert: "neutral",
  noticeSynced: true,
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveNotices(_state: StudioState): Resolved {
  return {}
}
