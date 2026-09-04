/* Chapters whose values actually drive the preview and export. Everything
   else wears a WIP chip — on production only, so previews and dev read as
   the finished panel. Add a chapter's id here in the PR that wires it
   (issue #666); a composite index card drops its chip once every member is
   wired. */

export const WIRED_CHAPTERS = new Set<string>([])

const SHOW_WIP = import.meta.env.VERCEL_ENV === "production"

export function showWip(memberIds: string[]): boolean {
  return SHOW_WIP && !memberIds.every((id) => WIRED_CHAPTERS.has(id))
}
