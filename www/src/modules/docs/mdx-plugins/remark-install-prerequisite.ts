import type { Paragraph, Root, RootContent } from "mdast"
import type { Plugin } from "unified"
import { visit } from "unist-util-visit"

// `@dotui/<name>` only resolves once the studio's init has registered it.
const prerequisite: Paragraph = {
  type: "paragraph",
  children: [
    {
      type: "text",
      value: "Set up dotUI first — export your design system from the ",
    },
    {
      type: "link",
      url: "/studio",
      children: [{ type: "text", value: "Studio" }],
    },
    { type: "text", value: ", which registers " },
    { type: "inlineCode", value: "@dotui" },
    { type: "text", value: " in your project. See " },
    {
      type: "link",
      url: "/docs/installation",
      children: [{ type: "text", value: "Installation" }],
    },
    { type: "text", value: "." },
  ],
}

function addsDotuiItem(nodes: RootContent[]) {
  return nodes.some((node) => {
    let found = false
    visit(node, "code", (code) => {
      if (code.value.includes("add @dotui/")) found = true
    })
    return found
  })
}

/** Prefixes every `## Installation` section that runs `add @dotui/<name>` with the setup prerequisite. */
export const remarkInstallPrerequisite: Plugin<[], Root> = () => (tree) => {
  const start = tree.children.findIndex(
    (node) =>
      node.type === "heading" &&
      node.depth === 2 &&
      node.children[0]?.type === "text" &&
      node.children[0].value === "Installation",
  )
  if (start === -1) return

  const next = tree.children.findIndex(
    (node, i) => i > start && node.type === "heading" && node.depth <= 2,
  )
  const section = tree.children.slice(start + 1, next === -1 ? undefined : next)
  if (!addsDotuiItem(section)) return

  tree.children.splice(start + 1, 0, structuredClone(prerequisite))
}
