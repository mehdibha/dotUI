import fs from "node:fs/promises"
import path from "node:path"
import type { Element, ElementContent, Root, RootContent } from "hast"
import type {
  MdxJsxAttribute,
  MdxJsxAttributeValueExpression,
  MdxJsxFlowElementHast,
} from "mdast-util-mdx-jsx"
import { createHighlighter } from "shiki"
import type { Plugin } from "unified"
import { visit } from "unist-util-visit"

import { evalExpression, type Highlighter } from "../build-time"
import { buildSourceOverlay } from "../codegen/source-overlay"
import { demoInstallItems } from "../demo-source"
import {
  buildControlsFromReference,
  enrichControlsForSerialization,
  toControlSelections,
  toPascalCase,
} from "../interactive-demo/process-controls"
import type {
  ControlInput,
  InteractiveDemoNodeInfo,
  ProcessedInteractiveDemo,
} from "../interactive-demo/types"
import { loadApiReference } from "../references/loader"
import {
  type TransformedReference,
  transformReference,
} from "../references/transform"
import { transformDemo } from "./transformer"

const REGISTRY_UI_DIR = path.join(process.cwd(), "src/registry/ui")

let highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter(): Promise<Highlighter> {
  highlighterPromise ??= createHighlighter({
    themes: ["github-light", "github-dark"],
    langs: ["tsx", "ts"],
  })
  return highlighterPromise
}

interface DemoNodeInfo {
  node: MdxJsxFlowElementHast
  name: string
  type: "Demo" | "Example"
  title?: string
  titleId?: string
}

interface ProcessedDemo {
  nodeInfo: DemoNodeInfo
  importName: string
  importPath: string
  sourceHast: Root
  previewHast: Root
  /** Registry items to install for this demo (the page component + extra imports). */
  install: string[]
}

interface ReferenceNodeInfo {
  node: MdxJsxFlowElementHast
  name: string
}

interface ProcessedReference {
  nodeInfo: ReferenceNodeInfo
  data: TransformedReference
}

const rehypeTransform: Plugin<[], Root> = () => {
  return async (tree, file) => {
    const fail =
      (tag: string, name: string | null) =>
      (error: unknown): never => {
        const reason = error instanceof Error ? error.message : String(error)
        const element = name === null ? `<${tag}>` : `<${tag} name="${name}">`
        throw new Error(
          `[rehype-transform] ${file.path}: ${element}: ${reason}`,
          { cause: error },
        )
      }

    const demoNodes: DemoNodeInfo[] = []
    const referenceNodes: ReferenceNodeInfo[] = []
    const interactiveDemoNodes: InteractiveDemoNodeInfo[] = []
    // Example title ids are suffixed past every id already on the page
    // (markdown headings): rehypeToc lists both, keyed by id.
    const usedSlugs = new Set<string>()
    visit(tree, "element", (node: Element) => {
      const id = node.properties?.id
      if (typeof id === "string") usedSlugs.add(id)
    })
    const slugify = (text: string): string => {
      const base =
        text
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") || "example"
      let candidate = base
      let i = 1
      while (usedSlugs.has(candidate)) {
        i += 1
        candidate = `${base}-${i}`
      }
      usedSlugs.add(candidate)
      return candidate
    }

    visit(tree, "mdxJsxFlowElement", (node: MdxJsxFlowElementHast) => {
      if (
        node.name !== "Demo" &&
        node.name !== "Example" &&
        node.name !== "Reference" &&
        node.name !== "InteractiveDemo"
      ) {
        return
      }
      const tag = node.name
      const name = extractStringAttribute(node, "name")
      if (!name) return fail(tag, name)(new Error("missing a string `name`"))

      if (tag === "Demo" || tag === "Example") {
        const info: DemoNodeInfo = { node, name, type: tag }
        if (tag === "Example") {
          const title = extractStringAttribute(node, "title")
          if (title) {
            info.title = title
            info.titleId = slugify(title)
          }
        }
        demoNodes.push(info)
      } else if (tag === "Reference") {
        referenceNodes.push({ node, name })
      } else {
        let controls: ControlInput[]
        try {
          controls = extractControlsAttribute(node)
        } catch (error) {
          return fail(tag, name)(error)
        }
        const demoFile = extractStringAttribute(node, "file") ?? undefined
        interactiveDemoNodes.push({ node, name, controls, file: demoFile })
      }
    })

    if (
      demoNodes.length === 0 &&
      referenceNodes.length === 0 &&
      interactiveDemoNodes.length === 0
    ) {
      return
    }

    const highlighter = await getHighlighter()

    const [processedDemos, processedReferences, processedInteractiveDemos] =
      await Promise.all([
        Promise.all(
          demoNodes.map((info) =>
            processDemoNode(info, highlighter).catch(
              fail(info.type, info.name),
            ),
          ),
        ),
        Promise.all(
          referenceNodes.map((info) =>
            processReferenceNode(info, highlighter).catch(
              fail("Reference", info.name),
            ),
          ),
        ),
        Promise.all(
          interactiveDemoNodes.map((info) =>
            processInteractiveDemoNode(info, highlighter).catch(
              fail("InteractiveDemo", info.name),
            ),
          ),
        ),
      ])

    // Every demo and playground module default-exports its component.
    const imports = new Map<string, [path: string, name: string]>()
    for (const { importPath, importName } of [
      ...processedDemos,
      ...processedInteractiveDemos,
    ]) {
      imports.set(`${importPath}:${importName}`, [importPath, importName])
    }
    if (imports.size > 0) {
      tree.children.unshift(generateImportsNode(imports) as RootContent)
    }

    for (const processed of processedDemos) transformDemoNode(processed)
    for (const processed of processedReferences) {
      transformReferenceNode(processed)
    }
    for (const processed of processedInteractiveDemos) {
      transformInteractiveDemoNode(processed)
    }
  }
}

export default rehypeTransform

async function processDemoNode(
  info: DemoNodeInfo,
  highlighter: Highlighter,
): Promise<ProcessedDemo> {
  const rawSource = await fs.readFile(
    path.join(REGISTRY_UI_DIR, `${info.name}.tsx`),
    "utf-8",
  )
  const { source, preview } = transformDemo(rawSource)

  // defaultColor: false makes both light/dark use CSS variables instead of inline color
  const highlight = (code: string) => {
    const hast = highlighter.codeToHast(code, {
      lang: "tsx",
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    })
    markPreAsRaw(hast)
    return hast
  }

  return {
    nodeInfo: info,
    importName: generateImportName(info.name),
    importPath: `@/registry/ui/${info.name}`,
    sourceHast: highlight(source),
    previewHast: highlight(preview),
    install: demoInstallItems(info.name, rawSource),
  }
}

/** `data-raw` tells mdx-components not to wrap the `<pre>` again. */
function markPreAsRaw(hast: Root): void {
  visit(hast, "element", (node: Element) => {
    if (node.tagName === "pre") {
      node.properties = node.properties || {}
      node.properties["data-raw"] = true
    }
  })
}

function generateImportName(demoName: string): string {
  // "button/demos/default" -> "ButtonDemosDefault"
  return demoName
    .split(/[/-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}

function extractStringAttribute(
  node: MdxJsxFlowElementHast,
  attrName: string,
): string | null {
  const attr = node.attributes.find(
    (a): a is MdxJsxAttribute =>
      a.type === "mdxJsxAttribute" && a.name === attrName,
  )
  return attr && typeof attr.value === "string" ? attr.value : null
}

function extractControlsAttribute(node: MdxJsxFlowElementHast): ControlInput[] {
  const controlsAttr = node.attributes.find(
    (attr): attr is MdxJsxAttribute =>
      attr.type === "mdxJsxAttribute" && attr.name === "controls",
  )

  if (!controlsAttr || typeof controlsAttr.value === "string") {
    throw new Error("missing `controls={[…]}`")
  }

  // The MDX compiler keeps the expression's source in `.value`; evaluating it
  // handles negatives, nested objects and arrays without an ESTree walker.
  const exprValue = controlsAttr.value as
    | MdxJsxAttributeValueExpression
    | undefined
  const source = exprValue?.value
  if (!source || typeof source !== "string") {
    throw new Error("controls={…} has no source expression")
  }

  let value: unknown
  try {
    value = evalExpression(source)
  } catch (error) {
    throw new Error(
      `Failed to evaluate controls={…} (${(error as Error).message}). Source: ${source}`,
      { cause: error },
    )
  }
  if (!Array.isArray(value)) {
    throw new Error(`controls must be an array; got ${typeof value}`)
  }
  return value as ControlInput[]
}

/** `import ButtonDemosBasic from "…"` per entry. */
function generateImportsNode(
  imports: Map<string, [path: string, name: string]>,
): object {
  return {
    type: "mdxjsEsm",
    value: "",
    data: {
      estree: {
        type: "Program",
        sourceType: "module",
        body: [...imports.values()].map(([importPath, importName]) => ({
          type: "ImportDeclaration",
          specifiers: [
            {
              type: "ImportDefaultSpecifier",
              local: { type: "Identifier", name: importName },
            },
          ],
          source: { type: "Literal", value: importPath },
        })),
      },
    },
  }
}

function withoutAttributes(
  node: MdxJsxFlowElementHast,
  names: string[],
): MdxJsxFlowElementHast["attributes"] {
  return node.attributes.filter(
    (attr) => !(attr.type === "mdxJsxAttribute" && names.includes(attr.name)),
  )
}

function transformDemoNode(processed: ProcessedDemo): void {
  const { node } = processed.nodeInfo

  node.attributes = withoutAttributes(node, ["name"])
  node.attributes.push(makeIdentifierAttr("component", processed.importName))

  // sourceHast.children is the <pre><code>…</code></pre> structure
  const demoCodeElement: MdxJsxFlowElementHast = {
    type: "mdxJsxFlowElement",
    name: "DemoCode",
    attributes: [],
    children: processed.sourceHast.children as ElementContent[],
  }

  // The Example card renders the demo live and exposes its source via a "Show
  // code" modal. Inject a real <h3 id="{slug}">{title}</h3> so the title shows
  // up in the TOC (the `title` prop is kept too, for the modal heading), the
  // install items and demo file name for the modal, and the highlighted source
  // as a DemoCode slot the card routes into the modal.
  if (processed.nodeInfo.type === "Example") {
    const { title, titleId } = processed.nodeInfo
    const existing = (node.children ?? []) as ElementContent[]

    node.attributes.push(
      makeJsonParseAttr("install", JSON.stringify(processed.install)),
    )
    node.attributes.push({
      type: "mdxJsxAttribute",
      name: "file",
      value: `${processed.nodeInfo.name.split("/").pop()}.tsx`,
    })

    if (title && titleId) {
      const heading: Element = {
        type: "element",
        tagName: "h3",
        properties: { id: titleId },
        children: [{ type: "text", value: title }],
      }
      node.children = [heading, ...existing, demoCodeElement]
    } else {
      node.children = [...existing, demoCodeElement]
    }
    return
  }

  const demoCodePreviewElement: MdxJsxFlowElementHast = {
    type: "mdxJsxFlowElement",
    name: "DemoCodePreview",
    attributes: [],
    children: processed.previewHast.children as ElementContent[],
  }

  // Keep MDX-authored children (e.g. headings) ahead of the code slots
  node.children = [
    ...(node.children ?? []),
    demoCodeElement,
    demoCodePreviewElement,
  ] as ElementContent[]
}

async function processReferenceNode(
  info: ReferenceNodeInfo,
  highlighter: Highlighter,
): Promise<ProcessedReference> {
  const rawData = await loadApiReference(info.name)
  return { nodeInfo: info, data: transformReference(rawData, highlighter) }
}

function transformReferenceNode(processed: ProcessedReference): void {
  const { node } = processed.nodeInfo
  node.attributes = withoutAttributes(node, ["name"])
  node.attributes.push(
    makeJsonParseAttr("data", JSON.stringify(processed.data)),
  )
}

async function processInteractiveDemoNode(
  info: InteractiveDemoNodeInfo,
  highlighter: Highlighter,
): Promise<ProcessedInteractiveDemo> {
  const fileSlug = info.file ?? "playground"

  // The real demo source drives everything: defaults come from its param
  // signature and the displayed code is generated by overlaying control
  // values onto it.
  const rawSource = await fs.readFile(
    path.join(REGISTRY_UI_DIR, info.name, "demos", `${fileSlug}.tsx`),
    "utf-8",
  )
  const controls = await buildControlsFromReference(
    info.name,
    info.controls,
    rawSource,
  )

  return {
    nodeInfo: info,
    // Distinct per file so two playgrounds of one item can share a page.
    importName: toPascalCase(`${info.name}-${fileSlug.replaceAll("/", "-")}`),
    importPath: `@/registry/ui/${info.name}/demos/${fileSlug}`,
    controls: await enrichControlsForSerialization(
      info.name,
      controls,
      highlighter,
    ),
    codeTemplate: await buildSourceOverlay({
      source: rawSource,
      controls: toControlSelections(controls),
      componentName: info.name,
    }),
  }
}

function transformInteractiveDemoNode(
  processed: ProcessedInteractiveDemo,
): void {
  const { node } = processed.nodeInfo

  // Authoring attributes are replaced with the runtime props below.
  node.attributes = withoutAttributes(node, [
    "name",
    "controls",
    "engine",
    "file",
  ])
  node.attributes.push(makeIdentifierAttr("component", processed.importName))
  node.attributes.push(
    makeJsonParseAttr("controls", JSON.stringify(processed.controls)),
  )
  node.attributes.push(
    makeJsonParseAttr("codeTemplate", JSON.stringify(processed.codeTemplate)),
  )
}

function makeExpressionAttr(
  name: string,
  value: string,
  expression: object,
): MdxJsxAttribute {
  return {
    type: "mdxJsxAttribute",
    name,
    value: {
      type: "mdxJsxAttributeValueExpression",
      value,
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [{ type: "ExpressionStatement", expression }],
        },
      },
    } as MdxJsxAttributeValueExpression,
  }
}

/** `name={Identifier}` */
function makeIdentifierAttr(name: string, identifier: string): MdxJsxAttribute {
  return makeExpressionAttr(name, identifier, {
    type: "Identifier",
    name: identifier,
  })
}

/** `name={JSON.parse("…")}`, reviving the JSON at render time. */
function makeJsonParseAttr(name: string, jsonString: string): MdxJsxAttribute {
  const raw = JSON.stringify(jsonString)
  return makeExpressionAttr(name, `JSON.parse(${raw})`, {
    type: "CallExpression",
    callee: {
      type: "MemberExpression",
      object: { type: "Identifier", name: "JSON" },
      property: { type: "Identifier", name: "parse" },
      computed: false,
      optional: false,
    },
    arguments: [{ type: "Literal", value: jsonString, raw }],
    optional: false,
  })
}
