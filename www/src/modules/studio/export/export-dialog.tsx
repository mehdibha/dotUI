/**
 * The export surface for /studio: one compact dialog split by the user's
 * situation — scaffold a new app, or install into an existing one — with the
 * shadcn command as the single primary action. The trigger is passed as
 * children (the header CTA, the panel footer button).
 */

import { useState, type ReactNode } from "react"
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
  const urls = useExportUrl()

  const command =
    urls.status === "ready"
      ? buildInitCommands(urls.url("init"))[packageManager] +
        (mode === "new" ? ` --template ${template}` : "")
      : undefined
  const addCommand = buildInstallCommands(["button"])[packageManager]

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
            you add after installs already themed.
          </p>
        )}

        <Section label="Code style">
          <CodeOptions />
        </Section>

        {command ? (
          <CommandBlock
            commands={
              mode === "new"
                ? [{ label: "Scaffold", command }]
                : [
                    { label: "Register", command },
                    { label: "Add components", command: addCommand },
                  ]
            }
          />
        ) : urls.status === "failed" ? (
          <div className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-xs text-fg-muted">
            Couldn't publish this design system.
            <Button variant="quiet" size="xs" onPress={urls.retry}>
              Retry
            </Button>
          </div>
        ) : (
          <p className="rounded-md border px-3 py-2 text-xs text-fg-muted">
            Publishing your design system…
          </p>
        )}
      </DialogBody>

      <DialogFooter className="flex-col sm:flex-col">
        <Button
          variant="primary"
          className="w-full"
          isDisabled={!command}
          onPress={() => command && copyToClipboard(command)}
        >
          {isCopied ? "Copied" : "Copy command"}
        </Button>
        {mode === "new" && urls.status === "ready"
          ? OPEN_IN_TARGETS.map((target) => (
              <LinkButton
                key={target.id}
                variant="secondary"
                href={target.href(urls.url)}
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
 * Each line copies on its own; the first is what the footer button copies.
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
    <div className="flex items-center gap-2 py-1.5 pr-1.5 pl-3">
      <code className="min-w-0 flex-1 scrollbar-none overflow-x-auto mask-[linear-gradient(to_right,black_calc(100%-1.5rem),transparent)] font-mono text-xs whitespace-nowrap text-fg">
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
