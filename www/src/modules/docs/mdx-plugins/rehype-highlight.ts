import { codeFenceToHast } from "@tanstack/highlight/markdown"
import type { Element, Root } from "hast"
import type { Plugin } from "unified"
import { visit } from "unist-util-visit"

import { highlighter } from "./highlighter"

/**
 * Replaces `<pre><code class="language-x">` blocks with @tanstack/highlight
 * markup (fumadocs' shiki-based rehypeCode is disabled in source.config.ts).
 * Fence meta is honored: `title="…"` lands as data-title on the <pre>,
 * `{1,3-5}` / `ins=` / `del=` become line decorations, `lineNumbers` adds the
 * th-code--line-numbers class, and `[!code ++/--]` comments work inline.
 */
const rehypeHighlight: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName !== "pre" || index === undefined || !parent) return
      const code = node.children.find(
        (child): child is Element =>
          child.type === "element" && child.tagName === "code",
      )
      if (!code) return

      const lang = getLanguage(code)
      const meta = (code.data as { meta?: string } | undefined)?.meta
      const highlighted = codeFenceToHast(
        { code: collectText(code).trimEnd(), lang, meta },
        highlighter,
      )
      parent.children[index] = highlighted as unknown as Element
      return "skip"
    })
  }
}

export default rehypeHighlight

function getLanguage(code: Element): string | undefined {
  const className = code.properties?.className
  const classes = Array.isArray(className) ? className : []
  return classes
    .find((value) => typeof value === "string" && value.startsWith("language-"))
    ?.toString()
    .slice("language-".length)
}

function collectText(node: Element): string {
  let text = ""
  visit(node, "text", (child: { value: string }) => {
    text += child.value
  })
  return text
}
