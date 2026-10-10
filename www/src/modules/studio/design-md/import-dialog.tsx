"use client"

/* Import DESIGN.md: paste, drop, pick or link a file, read the report of
   what maps, and create a design system from it. Lazy: the parser and its
   YAML chunk load only when this opens. */

import { useEffect, useRef, useState } from "react"

import { cleanName, MAX_NAME_LENGTH } from "@/lib/snapshots/snapshot"
import { Button } from "@/registry/ui/button"
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { DropZone } from "@/registry/ui/drop-zone"
import type { DropZoneProps } from "@/registry/ui/drop-zone"
import { FieldError, Label } from "@/registry/ui/field"
import { FileTrigger } from "@/registry/ui/file-trigger"
import { Input, TextArea } from "@/registry/ui/input"
import { Modal } from "@/registry/ui/modal"
import { TextField } from "@/registry/ui/text-field"

import { formatIssues, validate } from "../axes"
import { createImported } from "../selection"
import { uniqueName, useWorkspace } from "../workspace"
import { importDesignMd } from "./index"
import type { DesignMdImport, ImportCategory, ImportItem } from "./index"
import { MAX_BYTES } from "./parse"

type DropEvent = Parameters<NonNullable<DropZoneProps["onDrop"]>>[0]

const FETCH_TIMEOUT = 10_000
const TOO_LARGE = "This file is over 512 KB."
const FETCH_FAILED = "Couldn't fetch that file."

const GROUPS = [
  ["approximated", "Approximated"],
  ["mapped", "Applied"],
  ["unmapped", "Not imported"],
] as const

const CATEGORIES: Record<ImportCategory, string> = {
  color: "Color",
  typography: "Typography",
  shape: "Shape",
  space: "Space",
  surfaces: "Surfaces",
  components: "Components",
  icons: "Icons",
  links: "Links",
  layout: "Layout",
  motion: "Motion",
}

/** A raw GitHub URL for a pasted GitHub file link; no other host serves
 *  DESIGN.md with CORS. */
function rawUrl(text: string): string | undefined {
  const value = text.trim()
  if (!value || /\s/.test(value)) return
  if (/^https:\/\/raw\.githubusercontent\.com\//.test(value)) return value
  const blob = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^?#]+)/.exec(
    value,
  )
  if (blob)
    return `https://raw.githubusercontent.com/${blob[1]}/${blob[2]}/${blob[3]}`
}

async function fetchText(url: string, signal: AbortSignal): Promise<string> {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(String(response.status))
  if (Number(response.headers.get("content-length") ?? 0) > MAX_BYTES)
    throw new Error(TOO_LARGE)
  const text = await response.text()
  if (text.length > MAX_BYTES) throw new Error(TOO_LARGE)
  return text
}

export default function ImportDialog({ onClose }: { onClose: () => void }) {
  return (
    // Not dismissed by a press outside, like the name dialog.
    <Modal
      isOpen
      onOpenChange={(isOpen) => !isOpen && onClose()}
      isDismissable={false}
      className="sm:max-w-lg"
    >
      <DialogContent>
        <ImportForm close={onClose} />
      </DialogContent>
    </Modal>
  )
}

function ImportForm({ close }: { close: () => void }) {
  const workspace = useWorkspace()
  const [text, setText] = useState("")
  const [error, setError] = useState<string>()
  const [fetching, setFetching] = useState(false)
  const [result, setResult] = useState<DesignMdImport>()
  const [name, setName] = useState("")
  const nameEdited = useRef(false)
  const request = useRef(0)
  const systems = useRef(workspace.systems)
  systems.current = workspace.systems

  useEffect(() => {
    const id = ++request.current
    const url = rawUrl(text)
    if (url) {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT)
      setFetching(true)
      fetchText(url, controller.signal)
        .then((content) => {
          if (id === request.current) setText(content)
        })
        .catch((e: unknown) => {
          if (id !== request.current) return
          setError(
            e instanceof Error && e.message === TOO_LARGE
              ? TOO_LARGE
              : FETCH_FAILED,
          )
        })
        .finally(() => {
          clearTimeout(timer)
          if (id === request.current) setFetching(false)
        })
      return () => {
        clearTimeout(timer)
        controller.abort()
      }
    }
    setFetching(false)
    if (!text.trim()) {
      setResult(undefined)
      return
    }
    const timer = setTimeout(() => {
      void importDesignMd(text).then((next) => {
        if (id !== request.current) return
        setResult(next)
        if (!nameEdited.current)
          setName(
            uniqueName(next.name ?? "Imported design system", systems.current),
          )
      })
    }, 150)
    return () => clearTimeout(timer)
  }, [text])

  async function readFile(file: File | undefined) {
    if (!file) return
    if (file.size > MAX_BYTES) {
      setError(TOO_LARGE)
      return
    }
    setError(undefined)
    setText(await file.text())
  }

  async function onDrop(e: DropEvent) {
    for (const item of e.items) {
      if (item.kind === "file") {
        const markdown =
          /\.(md|markdown)$/i.test(item.name) ||
          /^text\/(markdown|x-markdown|plain)$/.test(item.type)
        if (markdown) return readFile(await item.getFile())
      }
      if (item.kind === "text" && item.types.has("text/plain")) {
        setError(undefined)
        return setText(await item.getText("text/plain"))
      }
    }
    setError("Drop a .md or plain text file.")
  }

  const clean = cleanName(name)
  const isTaken = workspace.systems.some((s) => s.name === clean)
  const ready = !!result && result.source !== "none" && !!clean && !isTaken
  const submitted = useRef(false)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!ready || submitted.current) return
        const valid = validate(result.state)
        if (!valid.ok) {
          console.error(formatIssues(valid.issues))
          return
        }
        submitted.current = true
        createImported(clean, valid.state)
        close()
      }}
      className="contents"
    >
      <DialogHeader>
        <DialogTitle>Import DESIGN.md</DialogTitle>
      </DialogHeader>
      <DropZone
        aria-label="Drop a DESIGN.md"
        onDrop={(e) => void onDrop(e)}
        className="w-full items-stretch gap-2 p-3"
      >
        <TextField
          value={text}
          onChange={(value) => {
            setText(value)
            setError(undefined)
          }}
          isInvalid={!!error}
          className="w-full"
        >
          <Label>DESIGN.md</Label>
          <TextArea
            autoFocus
            rows={8}
            spellCheck={false}
            placeholder="Paste a DESIGN.md or a GitHub link"
            className="max-h-48 overflow-auto font-mono text-xs"
          />
          <FieldError>{error}</FieldError>
        </TextField>
        <div className="flex items-center gap-3">
          <FileTrigger
            acceptedFileTypes={[".md", "text/markdown", "text/plain"]}
            onSelect={(files) => void readFile(files?.[0])}
          >
            <Button size="sm">Choose file…</Button>
          </FileTrigger>
          <span className="text-xs text-fg-muted">
            {fetching ? "Fetching…" : "or drop a file here"}
          </span>
        </div>
      </DropZone>
      {result?.source === "none" && (
        <p className="text-sm text-fg-muted">
          No colors found: this doesn't read as a DESIGN.md.
        </p>
      )}
      {result && result.source !== "none" && (
        <>
          <TextField
            value={name}
            onChange={(value) => {
              nameEdited.current = true
              setName(value)
            }}
            maxLength={MAX_NAME_LENGTH}
            isInvalid={isTaken}
            className="w-full"
          >
            <Label>Name</Label>
            <Input placeholder="My design system" />
            <FieldError>Another design system has this name.</FieldError>
          </TextField>
          <Report result={result} />
        </>
      )}
      <DialogFooter>
        <Button slot="close">Cancel</Button>
        <Button type="submit" variant="primary" isDisabled={!ready}>
          Create
        </Button>
      </DialogFooter>
    </form>
  )
}

function Report({ result }: { result: DesignMdImport }) {
  const { report, warnings } = result
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm">
        {report.mapped.length} applied · {report.approximated.length}{" "}
        approximated · {report.unmapped.length} not imported
      </p>
      <div className="flex max-h-64 flex-col gap-4 overflow-auto rounded-md border p-3 text-sm">
        {GROUPS.map(([status, title]) =>
          report[status].length > 0 ? (
            <section key={status} className="flex flex-col gap-2">
              <h3 className="font-medium">{title}</h3>
              {byCategory(report[status]).map(([category, list]) => (
                <div key={category} className="flex flex-col gap-1">
                  <h4 className="text-xs text-fg-muted">
                    {CATEGORIES[category]}
                  </h4>
                  <ul className="flex flex-col gap-0.5">
                    {list.map((item) => (
                      <li key={item.id} className="flex gap-2">
                        <span className="min-w-0 flex-1 truncate">
                          {item.label}
                        </span>
                        <span className="shrink-0 text-fg-muted tabular-nums">
                          {item.delta ?? item.value ?? item.result}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ) : null,
        )}
        {warnings.length > 0 && (
          <ul className="flex flex-col gap-0.5 text-xs text-fg-muted">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function byCategory(items: ImportItem[]): [ImportCategory, ImportItem[]][] {
  const groups = new Map<ImportCategory, ImportItem[]>()
  for (const item of items)
    groups.set(item.category, [...(groups.get(item.category) ?? []), item])
  return [...groups]
}
