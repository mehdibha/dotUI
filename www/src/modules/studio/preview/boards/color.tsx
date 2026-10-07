import { STEPS } from "@dotui/colors"

import { createParamValue } from "@/lib/styles"
import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Alert, AlertTitle } from "@/registry/ui/alert"
import { Badge } from "@/registry/ui/badge"
import { Button, useButtonStyles } from "@/registry/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox"
import { useStyles as useDialogStyles } from "@/registry/ui/dialog/styles"
import { Label } from "@/registry/ui/field"
import { useStyles as useInputStyles } from "@/registry/ui/input/styles"
import { Link } from "@/registry/ui/link"
import { useStyles as useModalStyles } from "@/registry/ui/modal/styles"
import { useStyles as usePopoverStyles } from "@/registry/ui/popover/styles"
import { Radio, RadioControl, RadioGroup } from "@/registry/ui/radio-group"
import { useStyles as useSidebarStyles } from "@/registry/ui/sidebar/styles"
import { Slider, SliderControl } from "@/registry/ui/slider"
import { Switch, SwitchControl } from "@/registry/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"
import { Tab, TabList, Tabs } from "@/registry/ui/tabs"
import { Tag, TagGroup, TagList } from "@/registry/ui/tag-group"
import { useStyles as useToastStyles } from "@/registry/ui/toast/styles"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group"
import { useStyles as useTokenStyles } from "@/registry/ui/token-field/styles"

import { Board, BoardSection, stateProps } from "./board"

/* ------------------------------- Specimens -------------------------------- */

/** A specimen over its label. */
function Specimen({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <figure className="flex min-w-0 flex-col items-center gap-3">
      <div
        className={cn(
          "flex min-h-10 min-w-0 items-center justify-center",
          className,
        )}
      >
        {children}
      </div>
      <figcaption className="text-[11px] text-fg-muted">{label}</figcaption>
    </figure>
  )
}

/** A token-field token, at rest (the selected wash) or selected (the
 *  selection fill). */
function Token({
  selected,
  children,
}: {
  selected?: boolean
  children: React.ReactNode
}) {
  const { token } = useTokenStyles()()
  return (
    <span
      data-selected={selected || undefined}
      className={token({ className: "px-1.5 py-0.5 text-sm" })}
    >
      {children}
    </span>
  )
}

function FrozenInput({
  state,
  value,
}: {
  state: ReturnType<typeof stateProps>
  value: string
}) {
  const { input } = useInputStyles()()
  return (
    <input
      readOnly
      tabIndex={-1}
      aria-label={value}
      value={value}
      className={input({ className: "w-36" })}
      {...state}
    />
  )
}

/* --------------------------------- Primary -------------------------------- */

function FocusedButton() {
  const buttonStyles = useButtonStyles()
  return (
    <span
      inert
      className={buttonStyles({ variant: "secondary" })}
      {...stateProps("focus")}
    >
      Continue
    </span>
  )
}

function PrimarySection() {
  return (
    <BoardSection
      member="primary"
      title="Primary"
      axes={[
        "brand",
        "preserveSeed",
        "solidInk",
        "buttonColor",
        "checkboxColor",
        "radioColor",
        "switchColor",
        "selectionColor",
        "sliderColor",
        "tabsColor",
        "linkColor",
        "focusColor",
      ]}
      className="@container flex-col flex-nowrap items-stretch"
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 @lg:grid-cols-3">
        <Specimen label="Buttons">
          <Button variant="primary">Save changes</Button>
        </Specimen>
        <Specimen label="Checkbox">
          <Checkbox defaultSelected>
            <CheckboxControl />
            <Label>Email me</Label>
          </Checkbox>
        </Specimen>
        <Specimen label="Radio">
          <RadioGroup
            aria-label="Plan"
            defaultValue="pro"
            orientation="horizontal"
            className="flex-row gap-3"
          >
            <Radio value="pro">
              <RadioControl />
              <Label>Pro</Label>
            </Radio>
            <Radio value="team">
              <RadioControl />
              <Label>Team</Label>
            </Radio>
          </RadioGroup>
        </Specimen>
        <Specimen label="Switch">
          <Switch defaultSelected>
            <SwitchControl />
            <Label>Sync</Label>
          </Switch>
        </Specimen>
        <Specimen label="Selection" className="flex-wrap gap-2">
          <Token selected>Design</Token>
          <Token>Research</Token>
        </Specimen>
        <Specimen label="Slider" className="w-full max-w-40">
          <Slider aria-label="Volume" defaultValue={60} className="w-full">
            <SliderControl />
          </Slider>
        </Specimen>
        <Specimen label="Tabs">
          <Tabs defaultSelectedKey="activity">
            <TabList aria-label="Project" variant="line">
              <Tab id="activity">Activity</Tab>
              <Tab id="files">Files</Tab>
            </TabList>
          </Tabs>
        </Specimen>
        <Specimen label="Links">
          <Link href="#">View invoice</Link>
        </Specimen>
        <Specimen label="Focus ring">
          <FocusedButton />
        </Specimen>
      </div>
    </BoardSection>
  )
}

/* -------------------------------- Neutrals -------------------------------- */

const TEXT_LADDER = [
  { label: "Text", className: "text-fg font-medium", text: "Quarterly report" },
  { label: "Muted", className: "text-fg-muted", text: "Updated 3 hours ago" },
  { label: "Disabled", className: "text-fg-disabled", text: "Archived" },
]

const SURFACE_SWATCHES = [
  { label: "Page", className: "bg-bg" },
  { label: "Card", className: "bg-card" },
  { label: "Popover", className: "bg-popover" },
  { label: "Muted", className: "bg-muted" },
  { label: "Field", className: "bg-field" },
  { label: "Inverse", className: "bg-inverse" },
]

function NeutralsSection() {
  return (
    <BoardSection
      member="neutrals"
      title="Neutrals"
      axes={["neutralHue", "neutralTint", "controlEdge"]}
      className="@container flex-col flex-nowrap items-stretch gap-10"
    >
      <div className="grid gap-x-10 gap-y-8 @2xl:grid-cols-2">
        <dl className="flex flex-col gap-3">
          {TEXT_LADDER.map(({ label, className, text }) => (
            <div key={label} className="flex items-baseline gap-4">
              <dt className="w-16 shrink-0 text-[11px] text-fg-muted">
                {label}
              </dt>
              <dd className={cn("truncate text-sm", className)}>{text}</dd>
            </div>
          ))}
        </dl>
        <div className="grid grid-cols-3 gap-3 @md:grid-cols-6 @2xl:grid-cols-3">
          {SURFACE_SWATCHES.map(({ label, className }) => (
            <figure key={label} className="flex flex-col gap-1.5">
              <div className={cn("h-10 rounded-md border", className)} />
              <figcaption className="text-[11px] text-fg-muted">
                {label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-end justify-center gap-x-10 gap-y-6">
        <Specimen label="Hairline">
          <div className="w-36 border-t" />
        </Specimen>
        <Specimen label="Control edge">
          <FrozenInput state={stateProps("rest")} value="hello@acme.co" />
        </Specimen>
        <Specimen label="Unchecked">
          <Checkbox>
            <CheckboxControl />
            <Label>Remember me</Label>
          </Checkbox>
        </Specimen>
      </div>
    </BoardSection>
  )
}

/* -------------------------------- Surfaces -------------------------------- */

const useRecessedShell = createParamValue({
  componentName: "sidebar",
  paramName: "shell",
  defaultValue: "subtle",
  values: { subtle: false, page: false, recessed: true },
})

const NAV = ["Inbox", "Projects", "Reports", "Settings"]

const ACTIVITY = [
  "Maya renamed Q3 roadmap",
  "Leo commented on Pricing page",
  "Ana uploaded brand-guidelines.pdf",
  "Sam archived Old onboarding",
]

function SurfacesSection() {
  const { inner, inset } = useSidebarStyles()()
  const { popover } = usePopoverStyles()()
  const { backdrop, modal } = useModalStyles()()
  const { content, header, title, description, footer } = useDialogStyles()()
  const recessed = useRecessedShell()
  return (
    <BoardSection
      member="surfaces"
      title="Surfaces"
      axes={[
        "surfaceLayers",
        "surfaceEdge",
        "surfaceShadow",
        "surfaceGlass",
        "shellTone",
        "lightBg",
        "darkBg",
      ]}
      className="flex-col flex-nowrap items-stretch gap-0 overflow-hidden p-0 max-sm:p-0"
    >
      <div inert className="flex bg-sidebar">
        <div
          data-variant="inset"
          data-side="left"
          data-state="expanded"
          className={inner({
            className: "peer w-40 shrink-0 gap-1 p-3 max-sm:w-28",
          })}
        >
          {NAV.map((item, i) => (
            <span
              key={item}
              className={cn(
                "rounded-md px-2 py-1.5 text-sm text-fg-muted",
                i === 1 && "bg-fg/5 font-medium text-fg",
              )}
            >
              {item}
            </span>
          ))}
        </div>
        <div
          className={inset({
            className: cn(
              "@container min-w-0 p-6 max-sm:p-4",
              recessed && "md:my-2 md:mr-2",
            ),
          })}
        >
          <div className="flex w-full max-w-72 flex-col">
            <Card>
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent className="flex h-20 items-end gap-1.5">
                {[40, 64, 52, 80, 58, 92, 70].map((h, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-sm bg-accent"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </CardContent>
            </Card>
            {/* Over the card's bars, so glass has something to blur. */}
            <div
              data-popover=""
              className={popover({
                className:
                  "relative z-10 -mt-14 ml-auto w-56 max-w-full @md:-mr-24",
              })}
            >
              <div className={content()}>
                <div className={header()}>
                  <span className={title({ className: "font-medium" })}>
                    Share report
                  </span>
                  <span className={description()}>
                    Anyone with the link can view.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div inert className="border-t bg-bg p-6 max-sm:p-4">
        <div className="relative mx-auto flex max-w-md justify-center overflow-hidden rounded-lg border px-4 py-8">
          <ul className="absolute inset-0 flex flex-col gap-3 p-4">
            {ACTIVITY.map((line) => (
              <li key={line} className="flex items-center gap-3 text-sm">
                <span className="size-6 shrink-0 rounded-full bg-muted" />
                <span className="truncate text-fg-muted">{line}</span>
              </li>
            ))}
          </ul>
          <div className={backdrop()} />
          <div data-modal="" className={modal({ className: "max-w-sm" })}>
            <div className={content()}>
              <div className={header()}>
                <span className={title({ className: "text-base font-medium" })}>
                  Delete project?
                </span>
                <span className={description()}>
                  Its files and history will be removed for everyone.
                </span>
              </div>
              <div className={footer()}>
                <Button variant="secondary" size="sm">
                  Cancel
                </Button>
                <Button variant="danger" size="sm">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BoardSection>
  )
}

/* -------------------------------- Semantics ------------------------------- */

const STATUSES = [
  {
    variant: "success",
    label: "Success",
    Icon: CircleCheckIcon,
    title: "Payment received",
    inline: "Deployed 2 min ago",
    ink: "text-fg-success",
  },
  {
    variant: "warning",
    label: "Warning",
    Icon: TriangleAlertIcon,
    title: "Storage almost full",
    inline: "92% of quota used",
    ink: "text-fg-warning",
  },
  {
    variant: "danger",
    label: "Danger",
    Icon: CircleAlertIcon,
    title: "Build failed",
    inline: "3 checks failing",
    ink: "text-fg-danger",
  },
  {
    variant: "info",
    label: "Info",
    Icon: InfoIcon,
    title: "Update available",
    inline: "Version 2.4 is out",
    ink: "text-fg-info",
  },
] as const

/** A toast as it lands, frozen in place. */
function StaticToast({
  variant,
  Icon,
  children,
}: {
  variant: (typeof STATUSES)[number]["variant"]
  Icon: (typeof STATUSES)[number]["Icon"]
  children: React.ReactNode
}) {
  const { toast, content, body, icon, message, title } = useToastStyles()()
  return (
    <div
      data-position="bottom-right"
      className={toast({ variant, className: "static h-auto w-full" })}
    >
      <div className={content()}>
        <div className={body()}>
          <div className={icon({ variant })}>
            <Icon aria-hidden />
          </div>
          <div className={message()}>
            <span className={title({ variant })}>{children}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SemanticsSection() {
  return (
    <BoardSection
      member="semantics"
      title="Semantics"
      axes={["successSeed", "warningSeed", "dangerSeed", "selectionSeed"]}
      className="@container flex-col flex-nowrap items-stretch gap-8"
    >
      <div className="grid gap-x-6 gap-y-3 @xl:grid-cols-2">
        {STATUSES.map(({ variant, label, Icon, inline, ink }) => (
          <div key={variant} className="flex items-center gap-3">
            <Badge variant={variant}>{label}</Badge>
            <span className={cn("flex items-center gap-1.5 text-sm", ink)}>
              <Icon aria-hidden className="size-4" />
              {inline}
            </span>
          </div>
        ))}
      </div>
      <div className="grid gap-3 @xl:grid-cols-2">
        {STATUSES.map(({ variant, Icon, title }) => (
          <Alert key={variant} variant={variant}>
            <Icon />
            <AlertTitle>{title}</AlertTitle>
          </Alert>
        ))}
      </div>
      <div inert className="grid gap-3 @xl:grid-cols-2">
        {STATUSES.map(({ variant, Icon, title }) => (
          <StaticToast key={variant} variant={variant} Icon={Icon}>
            {title}
          </StaticToast>
        ))}
      </div>
      <div className="flex justify-center">
        <Specimen label="Selection" className="gap-3">
          <Checkbox defaultSelected aria-label="Selected">
            <CheckboxControl />
          </Checkbox>
          <Token selected>Design</Token>
        </Specimen>
      </div>
    </BoardSection>
  )
}

/* ------------------------------ Selected wash ----------------------------- */

const INVOICES = [
  { id: "INV-204", customer: "Northwind", amount: "$1,240" },
  { id: "INV-205", customer: "Globex", amount: "$860" },
  { id: "INV-206", customer: "Initech", amount: "$2,115" },
]

function SelectedWashSection() {
  return (
    <BoardSection
      member="selected-wash"
      title="Selected wash"
      axes={["selectedWash"]}
      className="flex-col flex-nowrap items-stretch gap-8"
    >
      <TableContainer className="w-full">
        <Table
          aria-label="Invoices"
          selectionMode="multiple"
          defaultSelectedKeys={["INV-205"]}
        >
          <TableHeader>
            <TableColumn isRowHeader>Invoice</TableColumn>
            <TableColumn>Customer</TableColumn>
            <TableColumn>Amount</TableColumn>
          </TableHeader>
          <TableBody>
            {INVOICES.map(({ id, customer, amount }) => (
              <TableRow key={id} id={id}>
                <TableCell>{id}</TableCell>
                <TableCell>{customer}</TableCell>
                <TableCell>{amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex flex-wrap items-end justify-center gap-x-10 gap-y-6">
        <Specimen label="Tags">
          <TagGroup
            aria-label="Topics"
            selectionMode="single"
            defaultSelectedKeys={["design"]}
          >
            <TagList>
              <Tag id="design">Design</Tag>
              <Tag id="growth">Growth</Tag>
              <Tag id="ops">Ops</Tag>
            </TagList>
          </TagGroup>
        </Specimen>
        <Specimen label="Toggles">
          <ToggleButtonGroup
            aria-label="View"
            selectionMode="single"
            defaultSelectedKeys={["board"]}
          >
            <ToggleButton id="list">List</ToggleButton>
            <ToggleButton id="board">Board</ToggleButton>
            <ToggleButton id="calendar">Calendar</ToggleButton>
          </ToggleButtonGroup>
        </Specimen>
        <Specimen label="Tokens" className="gap-2">
          <Token>Alex Kim</Token>
          <Token>Sam Lee</Token>
        </Specimen>
      </div>
    </BoardSection>
  )
}

/* -------------------------------- Palettes -------------------------------- */

const PALETTES = [
  { id: "accent", label: "Accent" },
  { id: "neutral", label: "Neutral" },
  { id: "success", label: "Success" },
  { id: "warning", label: "Warning" },
  { id: "danger", label: "Danger" },
  { id: "info", label: "Info" },
]

function PalettesSection() {
  return (
    <BoardSection
      member="palettes"
      title="Palettes"
      axes={["vividness", "brand", "neutralHue", "neutralTint"]}
      className="flex-col flex-nowrap items-stretch gap-2.5"
    >
      {PALETTES.map(({ id, label }) => (
        <div key={id} className="flex items-center gap-4">
          <span className="w-16 shrink-0 text-[11px] text-fg-muted">
            {label}
          </span>
          <div className="grid h-6 flex-1 grid-cols-12 overflow-hidden rounded-md outline -outline-offset-1 outline-fg/5">
            {STEPS.map((step) => (
              <span
                key={step}
                title={`${id}-${step}`}
                style={{ background: `var(--${id}-${step})` }}
              />
            ))}
          </div>
        </div>
      ))}
    </BoardSection>
  )
}

export default function ColorBoard() {
  return (
    <Board id="color">
      <PrimarySection />
      <NeutralsSection />
      <SurfacesSection />
      <SemanticsSection />
      <SelectedWashSection />
      <PalettesSection />
    </Board>
  )
}
