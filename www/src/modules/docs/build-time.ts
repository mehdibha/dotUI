// Shared by the MDX pipeline, which loads at vite config time: relative imports only.
import type { HighlighterGeneric } from "shiki"
import { Project, ScriptKind, type SourceFile } from "ts-morph"

// oxlint-disable-next-line typescript/no-explicit-any -- shiki's langs/themes generics aren't needed here
export type Highlighter = HighlighterGeneric<any, any>

const project = new Project({ useInMemoryFileSystem: true })
let fileCounter = 0

/** Parse TSX into a scratch source file. Pair with `releaseTsx`. */
export function parseTsx(source: string): SourceFile {
  return project.createSourceFile(`scratch-${fileCounter++}.tsx`, source, {
    scriptKind: ScriptKind.TSX,
    overwrite: true,
  })
}

export function releaseTsx(file: SourceFile): void {
  project.removeSourceFile(file)
}

/** Evaluate a JS expression from trusted authored source (MDX, demo signatures). */
export function evalExpression(source: string): unknown {
  // oxlint-disable-next-line no-new-func -- build-time only, on authored source
  return new Function(`"use strict"; return (${source});`)()
}
