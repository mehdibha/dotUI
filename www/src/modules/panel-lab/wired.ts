/* Chapters whose values actually drive the preview and export. Everything
   else wears a WIP chip. Add a chapter's id here in the PR that wires it
   (issue #666); a composite index card drops its chip once every member is
   wired. */

export const WIRED_CHAPTERS = new Set<string>([])

export function isWired(memberIds: string[]): boolean {
  return memberIds.every((id) => WIRED_CHAPTERS.has(id))
}
