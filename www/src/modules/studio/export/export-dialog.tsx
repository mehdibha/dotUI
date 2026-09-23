/**
 * The export surface for /studio: one compact dialog split by the user's
 * situation — scaffold a new app, or install into an existing one — with the
 * shadcn command as the single primary action. The trigger is passed as
 * children (the header CTA, the panel footer button).
 */

import { useState, type ReactNode } from "react"
import { track } from "@vercel/analytics"
import { ArrowUpRightIcon, CheckIcon, CopyIcon } from "lucide-react"
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

const PROJECT_NAME = "my-app"

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

  const initCommand = buildInitCommands(presetUrl("/r/init"))[packageManager]
  const addCommand = buildInstallCommands(["button"])[packageManager]
  // The template ships shadcn's cva button; swap in dotUI's so the app builds.
  // Existing: skip the overwrite and reinstall prompts; components stay as is.
  const primary: CommandEntry =
    mode === "new"
      ? {
          label: "Scaffold",
          steps: [
            `${initCommand} --template ${template} --name ${PROJECT_NAME}`,
            `cd ${PROJECT_NAME}`,
            `${addCommand} --overwrite --yes`,
          ],
        }
      : { label: "Register", steps: [`${initCommand} --force --no-reinstall`] }
  const commands =
    mode === "new"
      ? [primary]
      : [primary, { label: "Add components", steps: [addCommand] }]
  const command = joinSteps(primary.steps)

  const { isCopied, copyToClipboard } = useCopyToClipboard()
  const trackCopy = (line: string) =>
    track("export_command_copied", {
      mode,
      template: mode === "new" ? template : null,
      packageManager,
      line,
    })

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
            you add after installs already themed. Your components stay as they
            are, but your shadcn theme tokens (the CSS variables in your global
            stylesheet) are replaced.
          </p>
        )}

        <Section label="Code style">
          <CodeOptions />
        </Section>

        <CommandBlock commands={commands} onCopy={trackCopy} />
      </DialogBody>

      <DialogFooter className="flex-col sm:flex-col">
        <Button
          variant="primary"
          className="w-full"
          onPress={() => {
            copyToClipboard(command)
            trackCopy("primary")
          }}
        >
          {isCopied ? "Copied" : "Copy command"}
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
                onPress={() => track("export_open_in", { target: target.id })}
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

interface CommandEntry {
  label: string
  /** Chained with `&&` when copied; shown one per line. */
  steps: string[]
}

const joinSteps = (steps: string[]) => steps.join(" && ")

/**
 * The commands to run, under a package-manager switch shared with the docs.
 * Each line copies on its own; the first is what the footer button copies.
 */
function CommandBlock({
  commands,
  onCopy,
}: {
  commands: CommandEntry[]
  onCopy: (line: string) => void
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
          <CommandLine key={entry.label} {...entry} onCopy={onCopy} />
        ))}
      </div>
    </div>
  )
}

function CommandLine({
  label,
  steps,
  onCopy,
}: CommandEntry & { onCopy: (line: string) => void }) {
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  return (
    <div className="flex items-center gap-2 py-1.5 pr-1.5 pl-3">
      <code className="min-w-0 flex-1 font-mono text-xs wrap-anywhere text-fg">
        {steps.map((step, i) => (
          <span key={step} className="block">
            {step}
            {i < steps.length - 1 ? " &&" : null}
          </span>
        ))}
      </code>
      <Button
        variant="quiet"
        size="xs"
        isIconOnly
        aria-label={`Copy ${label.toLowerCase()} command`}
        onPress={() => {
          copyToClipboard(joinSteps(steps))
          onCopy(label.toLowerCase())
        }}
        className={cn(isCopied && "text-fg")}
      >
        {isCopied ? <CheckIcon /> : <CopyIcon />}
      </Button>
    </div>
  )
}
