import type { Root, RootContent } from "mdast"
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx"
import type { Plugin } from "unified"
import { visit } from "unist-util-visit"

// `@dotui/<name>` only resolves once `init` has registered the registry.
const prerequisite: MdxJsxFlowElement = {
  type: "mdxJsxFlowElement",
  name: "InstallPrerequisite",
  attributes: [],
  children: [
    {
      type: "paragraph",
      // A bare span, so the alert's text styles apply instead of the docs' <p>.
      data: { hName: "span" },
      children: [
        {
          type: "text",
          value:
            "Before adding components, initialize your project with your design system: open the ",
        },
        {
          type: "link",
          url: "/studio",
          children: [{ type: "text", value: "Studio" }],
        },
        { type: "text", value: " and run the init command from " },
        { type: "strong", children: [{ type: "text", value: "Export" }] },
        { type: "text", value: "." },
      ],
    },
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

/** Opens every `## Installation` section that runs `add @dotui/<name>` with an init reminder. */
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
