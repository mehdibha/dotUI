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
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/registry/ui/collapsible"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { publishSystem } from "@/modules/studio/publish"
import { useCurrent } from "@/modules/studio/selection"
import { clock } from "@/modules/studio/time"
import { usePublishStatus } from "@/modules/studio/workspace"

import { CodeOptions } from "./code-options"
import { KeepFocus } from "./keep-focus"
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
          <KeepFocus />
          <ExportDialogBody />
        </DialogContent>
      </Modal>
    </Dialog>
  )
}

/**
 * A view installs from its own path; the user's system from a published
 * version. With changes past the latest one, a switch picks between it and
 * publishing the changes. Opening never publishes.
 */
function ExportDialogBody() {
  const { doc, sel } = useCurrent()
  const status = usePublishStatus(doc)
  const [choice, setChoice] = useState<"published" | "latest">("published")
  const [failed, setFailed] = useState(false)

  if (!doc)
    return (
      <ExportCommands path={`${sel.kind === "preset" ? "p" : "s"}/${sel.id}`} />
    )
  if (status === undefined) return null
  const id = doc.id
  const count = doc.published.length
  const last = doc.published.at(-1)

  function publishLatest() {
    setFailed(false)
    publishSystem(id).then(
      (snapshot) => snapshot || setChoice("published"),
      () => setFailed(true),
    )
  }

  if (!last)
    return (
      <>
        <DialogHeader className="pr-8">
          <DialogTitle>Publish to export</DialogTitle>
          <DialogDescription>
            Export installs a published version of your design system. Later
            edits need a new publish.
          </DialogDescription>
        </DialogHeader>
        {failed && (
          <DialogBody>
            <p className="text-xs text-fg-danger">
              Couldn't publish this design system.
            </p>
          </DialogBody>
        )}
        <DialogFooter className="flex-col sm:flex-col">
          <Button
            variant="primary"
            className="w-full"
            isPending={status === "pending"}
            onPress={publishLatest}
          >
            {status === "pending" ? "Publishing…" : "Publish and export"}
          </Button>
        </DialogFooter>
      </>
    )

  const version = `v${count} · ${clock(last.at)}`
  if (status === "current")
    return <ExportCommands path={`s/${last.id}`} version={version} />

  const versions = (
    <SegmentedControl
      aria-label="Version"
      selectedKeys={[choice]}
      onSelectionChange={(keys) => {
        const next = [...keys][0]
        if (next !== "published" && next !== "latest") return
        setChoice(next)
        if (next === "latest") publishLatest()
      }}
    >
      <SegmentedControlItem id="published">
        Published · {clock(last.at)}
      </SegmentedControlItem>
      <SegmentedControlItem id="latest">
        Include latest changes
      </SegmentedControlItem>
    </SegmentedControl>
  )

  if (choice === "published")
    return (
      <ExportCommands path={`s/${last.id}`} version={version} top={versions} />
    )
  return (
    <>
      <DialogHeader className="pr-8">{versions}</DialogHeader>
      <DialogBody>
        {failed ? (
          <p className="text-xs text-fg-danger">
            Couldn't publish your changes ·{" "}
            <button
              type="button"
              onClick={publishLatest}
              className="underline underline-offset-2"
            >
              Try again
            </button>
          </p>
        ) : (
          <p role="status" className="text-xs text-fg-muted">
            Publishing your changes…
          </p>
        )}
      </DialogBody>
    </>
  )
}

function ExportCommands({
  path,
  version,
  top,
}: {
  /** `p/<preset>` or `s/<snapshot>`. */
  path: string
  /** The published version it installs, as "v3 · 3:42 PM". */
  version?: string
  top?: ReactNode
}) {
  const [mode, setMode] = useState<Mode>(() => modeStore.get())
  const [template, setTemplate] = useState<Template>(() => templateStore.get())
  const packageManager = packageManagerStore.useValue()
  const url = useExportUrl(path)

  const command =
    buildInitCommands(url("init"))[packageManager] +
    (mode === "new" ? ` --template ${template}` : "")
  const addCommand = buildInstallCommands(["button"])[packageManager]

  const { isCopied, copyToClipboard } = useCopyToClipboard()

  return (
    <>
      <DialogHeader className="pr-8">
        {top}
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

        <CommandBlock
          version={version}
          commands={
            mode === "new"
              ? [{ label: "Scaffold", command }]
              : [
                  { label: "Register", command },
                  { label: "Add components", command: addCommand },
                ]
          }
        />

        {version && (
          <Collapsible>
            <CollapsibleTrigger className="text-xs text-fg-muted">
              Already installed an older version?
            </CollapsibleTrigger>
            <CollapsiblePanel>
              <p className="pb-2 text-xs text-fg-muted">
                Point the <code className="font-mono">@dotui</code> registry in{" "}
                <code className="font-mono">components.json</code> at this
                version, then re-add your components with{" "}
                <code className="font-mono">--overwrite</code>.
              </p>
              <CommandBlock
                commands={[
                  {
                    label: "Registry",
                    command: `"@dotui": "${url("{name}")}"`,
                  },
                  { label: "Re-add", command: `${addCommand} --overwrite` },
                ]}
              />
            </CollapsiblePanel>
          </Collapsible>
        )}
      </DialogBody>

      <DialogFooter className="flex-col sm:flex-col">
        <Button
          variant="primary"
          className="w-full"
          onPress={() => copyToClipboard(command)}
        >
          {isCopied ? "Copied" : "Copy command"}
        </Button>
        {mode === "new" &&
          OPEN_IN_TARGETS.map((target) => (
            <LinkButton
              key={target.id}
              variant="secondary"
              href={target.href(url)}
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
          ))}
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
  version,
}: {
  commands: { label: string; command: string }[]
  version?: string
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
        className="flex items-center gap-1 border-b px-2 py-1.5"
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
        {version && (
          <span className="ml-auto pr-1 text-xs text-fg-muted tabular-nums">
            {version}
          </span>
        )}
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
