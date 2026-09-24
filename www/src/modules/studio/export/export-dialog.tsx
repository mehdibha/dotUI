/**
 * The export surface for /studio: one compact dialog split by the user's
 * situation — scaffold a new app, or install into an existing one — with the
 * shadcn command as the single primary action. The trigger is passed as
 * children (the header CTA, the panel footer button).
 */

import { useEffect, useState, type ReactNode } from "react"
import {
  ArrowUpRightIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  DownloadIcon,
} from "lucide-react"
import * as ToggleButtonPrimitives from "react-aria-components/ToggleButton"
import * as ToggleButtonGroupPrimitives from "react-aria-components/ToggleButtonGroup"

import { createPersistedStore, enumCodec } from "@/lib/persisted-store"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/registry/lib/utils"
import { Button, LinkButton } from "@/registry/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/registry/ui/dialog"
import { Label } from "@/registry/ui/field"
import { Modal } from "@/registry/ui/modal"
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioIndicator,
} from "@/registry/ui/radio-group"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import {
  buildInitCommands,
  buildInstallCommands,
  PACKAGE_MANAGERS,
  packageManagerStore,
} from "@/modules/docs/install-commands"
import type { PackageManager } from "@/modules/docs/install-commands"
import { useStudio } from "@/modules/studio/use-studio"

import { CodeOptions } from "./code-options"
import { OPEN_IN_TARGETS } from "./targets"
import { useExportUrl } from "./use-export-url"

const MODES = ["new", "existing"] as const
type Mode = (typeof MODES)[number]

/** `shadcn init --template` values the CLI can scaffold. */
const TEMPLATES = [
  { id: "next", name: "Next.js" },
  { id: "start", name: "TanStack Start" },
  { id: "vite", name: "Vite" },
  { id: "react-router", name: "React Router" },
] as const
type Template = (typeof TEMPLATES)[number]["id"]

// Both remembered: someone with an existing project exports there every time.
const modeStore = createPersistedStore<Mode>(
  "dotui-export-mode",
  "new",
  enumCodec(MODES, "new"),
)
const templateStore = createPersistedStore<Template>(
  "dotui-export-template",
  "next",
  enumCodec(
    TEMPLATES.map((t) => t.id),
    "next",
  ),
)

export function ExportDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      {children}
      <Modal className="sm:max-w-md">
        <DialogContent showCloseButton aria-label="Export design system">
          <ExportDialogBody />
        </DialogContent>
      </Modal>
    </Dialog>
  )
}

function ExportDialogBody() {
  const [mode, setMode] = useState<Mode>(() => modeStore.get())
  const [template, setTemplate] = useState<Template>(() => templateStore.get())
  const packageManager = packageManagerStore.useValue()
  const presetUrl = useExportUrl()

  const initUrl = presetUrl("/r/init")
  const command =
    buildInitCommands(initUrl)[packageManager] +
    (mode === "new" ? ` --template ${template}` : "")
  const addCommand = buildInstallCommands(["button"])[packageManager]
  const commands =
    mode === "new"
      ? [{ label: "Scaffold", command }]
      : [
          { label: "Register", command },
          { label: "Add components", command: addCommand },
        ]

  const { isCopied, copyToClipboard } = useCopyToClipboard()

  return (
    <>
      <DialogHeader className="pr-8">
        <SegmentedControl
          aria-label="Project type"
          selectedKeys={[mode]}
          onSelectionChange={(keys) => {
            const next = [...keys][0] as Mode | undefined
            if (!next) return
            setMode(next)
            modeStore.set(next)
          }}
        >
          <SegmentedControlItem id="new">New project</SegmentedControlItem>
          <SegmentedControlItem id="existing">
            Existing project
          </SegmentedControlItem>
        </SegmentedControl>
      </DialogHeader>

      <DialogBody className="gap-4 overflow-y-auto">
        {mode === "new" ? (
          <Section label="Framework">
            <RadioGroup
              aria-label="Framework"
              value={template}
              onChange={(value) => {
                setTemplate(value as Template)
                templateStore.set(value as Template)
              }}
              className="grid grid-cols-2 gap-2"
            >
              {TEMPLATES.map((t) => (
                <Radio key={t.id} value={t.id}>
                  <RadioControl>
                    <RadioIndicator />
                    <Label>{t.name}</Label>
                  </RadioControl>
                </Radio>
              ))}
            </RadioGroup>
          </Section>
        ) : (
          <p className="text-xs text-fg-muted">
            Run in your project root. Registers the design system in{" "}
            <code className="font-mono">components.json</code>; every component
            you add after installs already themed. Components land in{" "}
            <code className="font-mono">components/ui</code> with their own APIs
            — the CLI asks before replacing a file you already have, like a
            shadcn <code className="font-mono">button.tsx</code>.
          </p>
        )}

        <Section label="Code style">
          <CodeOptions />
        </Section>

        <CommandBlock commands={commands} />

        <ThemeCss />

        <p className="text-xs text-fg-muted">
          Built on React Aria Components. Requires React 19 and Tailwind CSS v4.
        </p>
      </DialogBody>

      <DialogFooter className="flex-col sm:flex-col">
        <Button
          variant="primary"
          className="w-full"
          onPress={() =>
            copyToClipboard(commands.map((entry) => entry.command).join("\n"))
          }
        >
          {isCopied
            ? "Copied"
            : commands.length > 1
              ? "Copy commands"
              : "Copy command"}
        </Button>
        {mode === "new"
          ? OPEN_IN_TARGETS.map((target) => (
              <LinkButton
                key={target.id}
                variant="secondary"
                href={target.href(presetUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <span className="flex items-center gap-1.5">
                  Open in
                  <span aria-label={target.name}>{target.wordmark}</span>
                </span>
                <ArrowUpRightIcon data-icon="inline-end" />
              </LinkButton>
            ))
          : null}
      </DialogFooter>
    </>
  )
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-fg-muted">{label}</span>
      {children}
    </div>
  )
}

/**
 * The commands to run, under a package-manager switch shared with the docs.
 * Each line copies on its own; the footer button copies them all.
 */
function CommandBlock({
  commands,
}: {
  commands: { label: string; command: string }[]
}) {
  const packageManager = packageManagerStore.useValue()

  return (
    <div className="rounded-md border bg-muted/40">
      <ToggleButtonGroupPrimitives.ToggleButtonGroup
        aria-label="Package manager"
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[packageManager]}
        onSelectionChange={(keys) => {
          const next = [...keys][0]
          if (typeof next === "string") {
            packageManagerStore.set(next as PackageManager)
          }
        }}
        className="flex gap-1 border-b px-2 py-1.5"
      >
        {PACKAGE_MANAGERS.map((pm) => (
          <ToggleButtonPrimitives.ToggleButton
            key={pm}
            id={pm}
            className="rounded-sm px-1.5 py-0.5 font-mono text-xs text-fg-muted focus-reset hover:text-fg focus-visible:focus-ring selected:bg-neutral selected:text-fg"
          >
            {pm}
          </ToggleButtonPrimitives.ToggleButton>
        ))}
      </ToggleButtonGroupPrimitives.ToggleButtonGroup>
      <div className="flex flex-col divide-y">
        {commands.map((entry) => (
          <CommandLine key={entry.label} {...entry} />
        ))}
      </div>
    </div>
  )
}

function CommandLine({ label, command }: { label: string; command: string }) {
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  return (
    <div className="flex items-start gap-2 py-1.5 pr-1.5 pl-3">
      <code className="min-w-0 flex-1 font-mono text-xs break-all text-fg">
        {command}
      </code>
      <Button
        variant="quiet"
        size="xs"
        isIconOnly
        aria-label={`Copy ${label.toLowerCase()} command`}
        onPress={() => copyToClipboard(command)}
        className={cn(isCopied && "text-fg")}
      >
        {isCopied ? <CheckIcon /> : <CopyIcon />}
      </Button>
    </div>
  )
}

interface RegistryInit {
  dependencies?: string[]
  cssVars?: {
    theme?: Record<string, string>
    light?: Record<string, string>
    dark?: Record<string, string>
  }
}

function download(filename: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/css" }))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function cssBlock(selector: string, vars: Record<string, string> = {}) {
  const lines = Object.entries(vars).map(
    ([key, value]) => `  ${key.startsWith("--") ? key : `--${key}`}: ${value};`,
  )
  return `${selector} {\n${lines.join("\n")}\n}`
}

/**
 * What `init` writes before you run it: the theme's CSS variables, read from
 * the same registry item the command fetches, plus the packages it installs.
 */
function ThemeCss() {
  const { encoded } = useStudio()
  const [isOpen, setOpen] = useState(false)
  const [item, setItem] = useState<RegistryInit | null>(null)
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  useEffect(() => {
    if (!isOpen) return
    const controller = new AbortController()
    setItem(null)
    fetch(`/r/init${encoded ? `?preset=${encoded}` : ""}`, {
      signal: controller.signal,
    })
      .then((res) => res.json() as Promise<RegistryInit>)
      .then(setItem)
      .catch(() => {})
    return () => controller.abort()
  }, [isOpen, encoded])

  // The order init writes them: the Tailwind aliases (fonts, radius scale,
  // motion), then the values per mode.
  const css = item
    ? [
        cssBlock("@theme inline", item.cssVars?.theme),
        cssBlock(":root", item.cssVars?.light),
        cssBlock(".dark", item.cssVars?.dark),
      ].join("\n\n")
    : ""

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="quiet"
        size="sm"
        aria-expanded={isOpen}
        onPress={() => setOpen(!isOpen)}
        className="-ml-2 self-start text-fg-muted"
      >
        Preview theme CSS
        <ChevronDownIcon
          data-icon="inline-end"
          className={cn(isOpen && "rotate-180")}
        />
      </Button>
      {isOpen && (
        <div className="rounded-md border bg-muted/40">
          <div className="flex items-start justify-between gap-2 border-b py-1.5 pr-1.5 pl-3">
            <span className="min-w-0 text-xs text-fg-muted">
              {item?.dependencies?.length
                ? `Installs ${item.dependencies.join(", ")}`
                : "globals.css"}
            </span>
            <span className="flex shrink-0">
              <Button
                variant="quiet"
                size="xs"
                isIconOnly
                aria-label="Download theme CSS"
                isDisabled={!item}
                onPress={() => download("theme.css", css)}
              >
                <DownloadIcon />
              </Button>
              <Button
                variant="quiet"
                size="xs"
                isIconOnly
                aria-label="Copy theme CSS"
                isDisabled={!item}
                onPress={() => copyToClipboard(css)}
              >
                {isCopied ? <CheckIcon /> : <CopyIcon />}
              </Button>
            </span>
          </div>
          <pre className="max-h-[40vh] overflow-auto px-3 py-2 font-mono text-xs text-fg">
            {item ? css : "Loading…"}
          </pre>
        </div>
      )}
    </div>
  )
}
