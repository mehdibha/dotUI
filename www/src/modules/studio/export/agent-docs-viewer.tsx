"use client"

/* The agent docs a system ships, file by file — what `shadcn init` writes
   next to the components. Lazy: the generator and its component catalog load
   only when the viewer opens. */

import { useMemo, useState } from "react"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { Button } from "@/registry/ui/button"
import {
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import {
  ListBox,
  ListBoxItem,
  ListBoxItemDescription,
  ListBoxItemLabel,
} from "@/registry/ui/list-box"

import type { StudioState } from "../axes"
import { buildAgentDocs } from "./agent-docs"

export default function AgentDocsViewer({ state }: { state: StudioState }) {
  const docs = useMemo(() => buildAgentDocs({ state }), [state])
  const [path, setPath] = useState("DESIGN.md")
  const doc = docs.find((d) => d.path === path)
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  return (
    <>
      <DialogHeader>
        <DialogTitle>Agent docs</DialogTitle>
        <DialogDescription>
          Installed with your design system. Coding agents read them to build
          with your components, in your voice.
        </DialogDescription>
      </DialogHeader>
      <DialogBody className="grid min-h-0 gap-3 sm:grid-cols-[14rem_minmax(0,1fr)]">
        <ListBox
          aria-label="Files"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[path]}
          onSelectionChange={(keys) => {
            if (keys === "all") return
            const next = keys.values().next().value
            if (next) setPath(next as string)
          }}
        >
          {docs.map((d) => (
            <ListBoxItem key={d.path} id={d.path} textValue={d.path}>
              <ListBoxItemLabel className="font-mono text-xs">
                {d.path.split("/").pop()}
              </ListBoxItemLabel>
              {d.path.includes("/") && (
                <ListBoxItemDescription className="truncate font-mono text-xs">
                  {d.path.slice(0, d.path.lastIndexOf("/"))}
                </ListBoxItemDescription>
              )}
            </ListBoxItem>
          ))}
        </ListBox>
        <pre className="max-h-[60vh] overflow-auto rounded-md bg-muted p-3 font-mono text-xs whitespace-pre-wrap text-fg">
          {doc?.content}
        </pre>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="primary"
          onPress={() => copyToClipboard(doc?.content ?? "")}
        >
          {isCopied ? "Copied" : "Copy file"}
        </Button>
      </DialogFooter>
    </>
  )
}
