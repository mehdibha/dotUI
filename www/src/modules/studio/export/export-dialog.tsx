/**
 * The export surface for /studio: one compact dialog split by the user's
 * situation — scaffold a new app, or install into an existing one — with the
 * shadcn command as the single primary action. The trigger is passed as
 * children (the header CTA, the panel footer button).
 */

import { Fragment, useEffect, useState, type ReactNode } from "react"
import { track } from "@vercel/analytics"
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
import * as workspace from "@/modules/studio/workspace"

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
  const status = workspace.usePublishStatus(doc)
  const [choice, setChoice] = useState<"published" | "latest">("published")
  const [failed, setFailed] = useState(false)
  // The version the switch opened on: it stays for the dialog's life, so
  // publishing the latest changes doesn't pull it from under the pointer.
  const [before, setBefore] = useState<{ id: string; at: number; n: number }>()
  const latest = doc?.published.at(-1)
  // A version published while the dialog is open is the one it installs,
  // not an older one to pick.
  const [openedOn] = useState(() => latest?.id)
  if (
    doc &&
    latest &&
    !before &&
    (status === "changed" || (status === "pending" && latest.id === openedOn))
  ) {
    setBefore({ ...latest, n: doc.published.length })
    // A publish already on its way (from Publish or Share) is the latest.
    if (status === "pending") setChoice("latest")
  }
  const docId = doc?.id
  const following = status === "pending" && choice === "latest"
  useEffect(() => {
    if (following && docId)
      workspace.publishing(docId)?.catch(() => setFailed(true))
  }, [following, docId])

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
            isDisabled={status === "pending"}
            onPress={publishLatest}
          >
            {status === "pending" ? "Publishing…" : "Publish and export"}
          </Button>
        </DialogFooter>
      </>
    )

  const version = `v${count} · ${clock(last.at)}`
  if (!before) return <ExportCommands path={`s/${last.id}`} version={version} />

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
      <SegmentedControlItem id="published" className="max-sm:text-xs">
        Published · {clock(before.at)}
      </SegmentedControlItem>
      <SegmentedControlItem id="latest" className="max-sm:text-xs">
        Include latest changes
      </SegmentedControlItem>
    </SegmentedControl>
  )

  if (choice === "published")
    return (
      <ExportCommands
        path={`s/${before.id}`}
        version={`v${before.n} · ${clock(before.at)}`}
        top={versions}
      />
    )
  if (status === "current")
    return (
      <ExportCommands path={`s/${last.id}`} version={version} top={versions} />
    )
  return (
    <ExportCommands
      path={`s/${last.id}`}
      top={versions}
      waiting={
        failed ? (
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
        )
      }
    />
  )
}

function ExportCommands({
  path,
  version,
  top,
  waiting,
}: {
  /** `p/<preset>` or `s/<snapshot>`. */
  path: string
  /** The published version it installs, as "v3 · 3:42 PM". */
  version?: string
  top?: ReactNode
  /** Shown instead of the commands until they can be installed. */
  waiting?: ReactNode
}) {
  const [mode, setMode] = useState<Mode>(() => modeStore.get())
  const [template, setTemplate] = useState<Template>(() => templateStore.get())
  const packageManager = packageManagerStore.useValue()
  const url = useExportUrl(path)

  const initCommand = buildInitCommands(url("init"))[packageManager]
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
      {/* The close button sits beside the short first row; the version
          switch below gets the full width. */}
      <DialogHeader>
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
        {top}
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
            you add after installs already themed. Your theme tokens, fonts and{" "}
            <code className="font-mono">lib/utils</code> are replaced, and
            adding a component means overwriting yours of the same name, like{" "}
            <code className="font-mono">button.tsx</code>.
          </p>
        )}

        <Section label="Code style">
          <CodeOptions />
        </Section>

        <CommandBlock
          version={version}
          waiting={waiting}
          commands={commands}
          onCopy={trackCopy}
        />

        {(version || waiting) && (
          <Collapsible isDisabled={!!waiting}>
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
                    steps: [`"@dotui": "${url("{name}")}"`],
                  },
                  { label: "Re-add", steps: [`${addCommand} --overwrite`] },
                ]}
                onCopy={trackCopy}
              />
            </CollapsiblePanel>
          </Collapsible>
        )}
      </DialogBody>

      <DialogFooter className="flex-col sm:flex-col">
        <Button
          variant="primary"
          className="w-full"
          isDisabled={!!waiting}
          onPress={() => {
            copyToClipboard(command)
            trackCopy("primary")
          }}
        >
          {isCopied ? "Copied" : "Copy command"}
        </Button>
        {mode === "new" &&
          OPEN_IN_TARGETS.map((target) => (
            <LinkButton
              key={target.id}
              variant="secondary"
              href={target.href(url)}
              isDisabled={!!waiting}
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
  version,
  waiting,
}: {
  commands: CommandEntry[]
  onCopy: (line: string) => void
  version?: string
  /** Holds the commands' place until they can be installed. */
  waiting?: ReactNode
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
        {commands.map((entry, index) =>
          waiting ? (
            <div key={entry.label} className="flex h-9 items-center pl-3">
              {index === 0 && waiting}
            </div>
          ) : (
            <CommandLine key={entry.label} {...entry} onCopy={onCopy} />
          ),
        )}
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
      <code className="min-w-0 flex-1 font-mono text-xs text-fg">
        {steps.map((step, i) => (
          <span key={step} className="block">
            {/* Only the URL may break; flags wrap as whole tokens. */}
            {[...step.split(" "), ...(i < steps.length - 1 ? ["&&"] : [])].map(
              (token, j) => (
                <Fragment key={j}>
                  {j > 0 ? " " : null}
                  <span
                    className={
                      token.includes("://")
                        ? "wrap-anywhere"
                        : "whitespace-nowrap"
                    }
                  >
                    {token}
                  </span>
                </Fragment>
              ),
            )}
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
