import type { ComponentType, SVGProps } from "react"
import { compressToEncodedURIComponent } from "lz-string"

import { BoltIcon } from "@/components/icons/bolt"
import { ClaudeIcon } from "@/components/icons/claude"
import { FigmaIcon } from "@/components/icons/figma"
import { GeminiIcon } from "@/components/icons/gemini"
import { LovableIcon } from "@/components/icons/lovable"
import { OpenAIIcon } from "@/components/icons/openai"
import { ReplitIcon } from "@/components/icons/replit"
import { V0Icon } from "@/components/icons/v0"

import { buildFetchPrompt, buildPrompt } from "./prompt"
import type { ExportUrl } from "./types"

/**
 * An AI builder that starts a new project from the design system. Every tool
 * but v0 opens with a prompt that installs the registry. These only work from
 * the deployed origin: the tools fetch the registry server-side.
 */
export interface OpenInTarget {
  id: string
  name: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  /** The icon already spells the name. */
  wordmark?: boolean
  href: (url: ExportUrl) => string
  /** Copied on open, for tools that drop the prefilled prompt. */
  copy?: (url: ExportUrl) => string
}

const uri = (prompt: string) => encodeURIComponent(prompt)
const lz = (prompt: string) => compressToEncodedURIComponent(prompt)

export const OPEN_IN_TARGETS: OpenInTarget[] = [
  {
    id: "v0",
    name: "v0",
    icon: V0Icon,
    wordmark: true,
    // v0 writes the item's files verbatim, no AI setup step.
    href: (url) => `https://v0.app/chat/api/open?url=${uri(url("v0"))}`,
  },
  {
    id: "bolt",
    name: "Bolt",
    icon: BoltIcon,
    // Submits on open when signed in.
    href: (url) => `https://bolt.new/?prompt=${uri(buildPrompt(url))}`,
  },
  {
    id: "lovable",
    name: "Lovable",
    icon: LovableIcon,
    href: (url) => `https://lovable.dev/#prompt=${uri(buildPrompt(url))}`,
  },
  {
    id: "replit",
    name: "Replit",
    icon: ReplitIcon,
    // Prefills only for signed-out visitors; the signed-in home ignores it.
    href: (url) =>
      `https://replit.com/?stack=Build&prompt=${lz(buildPrompt(url))}&referrer=dotui.org`,
    copy: buildPrompt,
  },
  {
    id: "figma-make",
    name: "Figma Make",
    icon: FigmaIcon,
    href: (url) =>
      `https://www.figma.com/make/new#prompt=${lz(buildPrompt(url))}`,
  },
  {
    id: "ai-studio",
    name: "AI Studio",
    icon: GeminiIcon,
    href: (url) =>
      `https://aistudio.google.com/apps?prompt=${uri(buildPrompt(url))}`,
  },
  {
    id: "claude",
    name: "Claude",
    icon: ClaudeIcon,
    href: (url) => `https://claude.ai/new?q=${uri(buildFetchPrompt(url))}`,
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    icon: OpenAIIcon,
    // Submits on open.
    href: (url) => `https://chatgpt.com/?q=${uri(buildPrompt(url))}`,
  },
]
