"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { useComponentParams } from "@/lib/styles"
import {
  BellIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  ClockIcon,
  InfoIcon,
  SparklesIcon,
  TriangleAlertIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/registry/ui/alert"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Label } from "@/registry/ui/field"
import { Loader } from "@/registry/ui/loader"
import {
  ProgressBar,
  ProgressBarControl,
  ProgressBarOutput,
} from "@/registry/ui/progress-bar"
import { Skeleton } from "@/registry/ui/skeleton"
import { Tag, TagGroup, TagList } from "@/registry/ui/tag-group"
import { useStyles as useTagStyles } from "@/registry/ui/tag-group/styles"
import { ToastPrimitive, ToastProvider } from "@/registry/ui/toast"
import { useStyles as useToastStyles } from "@/registry/ui/toast/styles"

import { Board, BoardSection, StateRow, useBoardFocus } from "./board"

const SPEC_LABEL = "text-[11px] text-fg-muted"

const STACK =
  "@container flex-col flex-nowrap items-stretch justify-start gap-10"

/* ---------------------------------- Badge ---------------------------------- */

const STATUSES = [
  { variant: "neutral", label: "Neutral", text: "Draft", Icon: ClockIcon },
  { variant: "accent", label: "Accent", text: "Beta", Icon: SparklesIcon },
  { variant: "success", label: "Success", text: "Live", Icon: CircleCheckIcon },
  {
    variant: "warning",
    label: "Warning",
    text: "Paused",
    Icon: TriangleAlertIcon,
  },
  { variant: "danger", label: "Danger", text: "Failed", Icon: CircleAlertIcon },
] as const

const DEPLOYS = [
  { name: "acme-web", meta: "main · 2m ago", status: 2 },
  { name: "billing-api", meta: "fix/retry · 18m ago", status: 3 },
  { name: "docs", meta: "release/4.2 · 1h ago", status: 1 },
  { name: "mobile-sync", meta: "main · 3h ago", status: 4 },
] as const

function BadgeSection() {
  return (
    <BoardSection
      member="badge"
      title="Badge"
      axes={["badgeStyle", "badgeShape", "badgeCase", "dangerSeed"]}
      className={STACK}
    >
      <div className="flex flex-wrap justify-center gap-x-10 gap-y-8">
        {STATUSES.map(({ variant, label, text, Icon }) => (
          <div key={variant} className="flex flex-col items-center gap-3">
            <span className={SPEC_LABEL}>{label}</span>
            <Badge variant={variant} size="lg">
              {text}
            </Badge>
            <Badge variant={variant}>
              <Icon />
              {text}
            </Badge>
            <Badge variant={variant} size="sm">
              {variant === "neutral" ? 12 : text}
            </Badge>
          </div>
        ))}
      </div>
      <ul className="mx-auto w-full max-w-md divide-y rounded-(--studio-radius-card) border bg-card">
        {DEPLOYS.map((deploy) => {
          const { variant, text } = STATUSES[deploy.status]
          return (
            <li
              key={deploy.name}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">
                  {deploy.name}
                </span>
                <span className="truncate text-xs text-fg-muted">
                  {deploy.meta}
                </span>
              </span>
              <Badge variant={variant}>{text}</Badge>
            </li>
          )
        })}
      </ul>
    </BoardSection>
  )
}

/* ----------------------------------- Tag ----------------------------------- */

const FILTERS = [
  { id: "open", name: "Status: Open" },
  { id: "me", name: "Assignee: Me" },
  { id: "bug", name: "Label: Bug" },
  { id: "high", name: "Priority: High" },
]

function FrozenTag(attrs: Record<string, string>) {
  const { tag } = useTagStyles()()
  return (
    <span {...attrs} data-tag="" className={tag()}>
      Design
    </span>
  )
}

function TagSection() {
  const [filters, setFilters] = useState(FILTERS)
  return (
    <BoardSection
      member="tag"
      title="Tag"
      axes={["badgeStyle"]}
      className={STACK}
    >
      <div className="grid items-center gap-10 @2xl:grid-cols-[minmax(0,1fr)_auto] @2xl:gap-12">
        <div className="flex flex-col gap-6">
          <TagGroup
            onRemove={(keys) => {
              const left = filters.filter((filter) => !keys.has(filter.id))
              // Never empty: removing the last one brings them all back.
              setFilters(left.length ? left : FILTERS)
            }}
          >
            <Label>Filters</Label>
            <TagList items={filters}>
              {(filter) => <Tag>{filter.name}</Tag>}
            </TagList>
          </TagGroup>
          <TagGroup
            selectionMode="multiple"
            defaultSelectedKeys={["design", "research"]}
            disabledKeys={["legal"]}
          >
            <Label>Teams</Label>
            <TagList>
              <Tag id="design">Design</Tag>
              <Tag id="engineering">Engineering</Tag>
              <Tag id="research">Research</Tag>
              <Tag id="support">Support</Tag>
              <Tag id="legal">Legal</Tag>
            </TagList>
          </TagGroup>
        </div>
        <StateRow states={["rest", "focus", "selected", "disabled"]}>
          {(attrs) => <FrozenTag {...attrs} />}
        </StateRow>
      </div>
    </BoardSection>
  )
}

/* ---------------------------------- Alert ---------------------------------- */

const ALERTS = [
  {
    variant: "info",
    Icon: InfoIcon,
    title: "A new version is out",
    text: "Version 4.2 adds SSO and audit logs.",
    action: "Update",
  },
  {
    variant: "success",
    Icon: CircleCheckIcon,
    title: "Domain verified",
    text: "acme.com now serves over HTTPS.",
    action: "View",
  },
  {
    variant: "warning",
    Icon: TriangleAlertIcon,
    title: "Usage at 85%",
    text: "You'll run out of build minutes in 3 days.",
    action: "Upgrade",
  },
  {
    variant: "danger",
    Icon: CircleAlertIcon,
    title: "Payment failed",
    text: "We couldn't charge the card ending in 4242.",
    action: "Retry",
  },
] as const

function AlertSection() {
  return (
    <BoardSection
      member="alert"
      title="Alert"
      axes={["alertStyle", "successSeed", "warningSeed", "dangerSeed"]}
      className={STACK}
    >
      <div className="grid gap-4">
        <Alert>
          <BellIcon />
          <AlertTitle>Scheduled maintenance</AlertTitle>
          <AlertDescription>
            The dashboard is read-only on Sunday from 02:00 to 04:00 UTC.
          </AlertDescription>
        </Alert>
        <div className="grid gap-4 @3xl:grid-cols-2">
          {ALERTS.map(({ variant, Icon, title, text, action }) => (
            <Alert key={variant} variant={variant}>
              <Icon />
              <AlertTitle>{title}</AlertTitle>
              <AlertDescription>{text}</AlertDescription>
              <AlertAction>
                <Button size="sm">{action}</Button>
              </AlertAction>
            </Alert>
          ))}
        </div>
      </div>
    </BoardSection>
  )
}

/* ---------------------------------- Toast ---------------------------------- */

type ToastType = "neutral" | "success" | "info" | "warning" | "danger"

const TOAST_ICONS = {
  success: CircleCheckIcon,
  info: InfoIcon,
  warning: TriangleAlertIcon,
  danger: CircleAlertIcon,
  loading: Loader,
} as const

const TOASTS: {
  type: ToastType | "loading"
  title: string
  text?: string
  action?: string
}[] = [
  { type: "neutral", title: "Conversation archived", action: "Undo" },
  {
    type: "success",
    title: "Changes saved",
    text: "Your profile is up to date.",
  },
  {
    type: "info",
    title: "New comment",
    text: "Maya replied to your review.",
    action: "View",
  },
  {
    type: "warning",
    title: "Storage almost full",
    text: "9.2 of 10 GB used.",
  },
  {
    type: "danger",
    title: "Upload failed",
    text: "logo.svg is over 5 MB.",
    action: "Retry",
  },
  {
    type: "loading",
    title: "Publishing site",
    text: "This can take a minute.",
  },
]

/** The toast's own slots, in place instead of in its portaled stack. */
function StaticToast({ type, title, text, action }: (typeof TOASTS)[number]) {
  const styles = useToastStyles()()
  const { surface, status } = useComponentParams("toast")
  const Icon = type === "neutral" ? null : TOAST_ICONS[type]
  // Mirrors the toast's own pick: a solid status fill, else the inverse surface.
  const solid = status === "bold" ? true : status === "soft" ? false : undefined
  const onFill =
    (type === "neutral" || type === "loading" ? undefined : solid) ??
    surface === "inverse"
  return (
    <div
      data-slot="toast"
      className={styles.toast({
        variant: type,
        className: "relative h-auto w-full max-w-96",
      })}
    >
      <div className={styles.content()}>
        <div className={styles.body()}>
          {Icon && (
            <div className={styles.icon({ variant: type })}>
              <Icon aria-hidden />
            </div>
          )}
          <div className={styles.message()}>
            <div className={styles.title({ variant: type })}>{title}</div>
            {text && (
              <div className={styles.description({ variant: type })}>
                {text}
              </div>
            )}
          </div>
        </div>
        {action && (
          <div className={styles.actions()}>
            <Button
              size="sm"
              variant={onFill ? "quiet" : "secondary"}
              className={styles.action({ onFill })}
            >
              {action}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

const TILES = [
  "bg-primary",
  "bg-muted",
  "bg-accent",
  "bg-success",
  "bg-muted",
  "bg-warning",
  "bg-info",
  "bg-muted",
  "bg-danger",
  "bg-accent",
  "bg-muted",
  "bg-primary",
]

/** A gallery under the toasts, so glass has something to frost. */
function Backdrop() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 grid auto-rows-[7rem] grid-cols-2 gap-3 p-3 @2xl:auto-rows-fr @2xl:grid-cols-6"
    >
      {[...TILES, ...TILES].map((tone, index) => (
        <div
          key={index}
          className={cn("rounded-(--studio-radius-item) opacity-25", tone)}
        />
      ))}
    </div>
  )
}

function ToastSection() {
  return (
    <BoardSection
      member="toast"
      title="Toast"
      axes={["toastStyle", "toastStatus", "surfaceGlass", "dangerSeed"]}
      className="@container relative overflow-hidden p-0 max-sm:p-0"
    >
      <Backdrop />
      <div inert className="relative w-full p-8 max-sm:p-6">
        <div className="mx-auto grid max-w-[49rem] justify-items-center gap-3 @2xl:grid-cols-2">
          {TOASTS.map((toast) => (
            <StaticToast key={toast.type} {...toast} />
          ))}
        </div>
      </div>
    </BoardSection>
  )
}

/* ---------------------------------- Motion --------------------------------- */

const LIVE_TOASTS = [
  { title: "Changes saved", type: "success" },
  { title: "Invite sent to maya@acme.com", type: "info" },
  { title: "Conversation archived", type: undefined },
] as const

const REPLAY_MS = 1600

/** Live toasts, a gliding bar and a toggling tag, replayed while the panel edits their motion. */
function MotionSection() {
  const { axis } = useBoardFocus()
  const playing = axis === "feedbackMotion"
  const [manager] = useState(() => ToastPrimitive.createToastManager())
  const [stage, setStage] = useState<HTMLDivElement | null>(null)
  const [on, setOn] = useState(false)
  const count = useRef(0)

  const step = useCallback(() => {
    const toast = LIVE_TOASTS[count.current++ % LIVE_TOASTS.length]!
    manager.add({ title: toast.title, type: toast.type, timeout: 3000 })
    setOn((value) => !value)
  }, [manager])

  // One toast at rest, so the stage never reads empty.
  useEffect(() => {
    if (playing) return
    const id = manager.add({
      title: "Changes saved",
      type: "success",
      timeout: 0,
    })
    return () => manager.close(id)
  }, [manager, playing])

  useEffect(() => {
    if (!playing) return
    step()
    const timer = setInterval(step, REPLAY_MS)
    return () => {
      clearInterval(timer)
      setOn(false)
    }
  }, [playing, step])

  return (
    <BoardSection
      member="toast"
      title="Motion"
      axes={["feedbackMotion"]}
      className={STACK}
    >
      <div className="grid items-center gap-8 @2xl:grid-cols-[minmax(0,1fr)_minmax(0,16rem)] @2xl:gap-12">
        <div
          ref={setStage}
          // Transformed, so the fixed toast viewport anchors to this stage.
          className="relative h-40 w-full transform-gpu overflow-hidden rounded-(--studio-radius-card) border bg-muted/40 [&_[data-slot=toast-viewport]]:w-[calc(100%-2*var(--toast-inset))]"
        >
          <ToastProvider
            toastManager={manager}
            position="bottom-right"
            portalProps={{ container: stage }}
          >
            <div className="flex h-full items-start p-4">
              <Button size="sm" onPress={step}>
                Show toast
              </Button>
            </div>
          </ToastProvider>
        </div>
        <div className="flex flex-col gap-6">
          <ProgressBar value={on ? 80 : 25} className="w-full">
            <div className="flex items-center justify-between gap-2">
              <Label>Syncing</Label>
              <ProgressBarOutput />
            </div>
            <ProgressBarControl />
          </ProgressBar>
          <TagGroup
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[on ? "week" : "day"]}
            onSelectionChange={(keys) =>
              setOn(keys !== "all" && keys.has("week"))
            }
          >
            <Label>Range</Label>
            <TagList>
              <Tag id="day">Today</Tag>
              <Tag id="week">This week</Tag>
            </TagList>
          </TagGroup>
        </div>
      </div>
    </BoardSection>
  )
}

/* --------------------------------- Loading --------------------------------- */

const SPINNER_SIZES = ["size-3", "size-4", "size-5", "size-6", "size-8"]

function SpinnerSection() {
  return (
    <BoardSection
      member="loading"
      title="Spinner"
      axes={["spinnerStyle"]}
      className="gap-x-12 gap-y-8"
    >
      <div className="flex items-end gap-6">
        {SPINNER_SIZES.map((size) => (
          <Loader key={size} aria-label="Loading" className={size} />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button isPending>Refresh</Button>
        <Button variant="primary" isPending>
          Deploy
        </Button>
        <span className="flex items-center gap-2 text-sm text-fg-muted">
          <Loader aria-label="Loading" />
          Loading results
        </span>
      </div>
    </BoardSection>
  )
}

function SkeletonSection() {
  return (
    <BoardSection
      member="loading"
      title="Skeleton"
      axes={["skeletonAnimation"]}
      className="items-start gap-8"
    >
      <Skeleton isLoading className="w-full max-w-80">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Avatar size="lg">
              <AvatarFallback>MK</AvatarFallback>
            </Avatar>
            <div className="min-w-0 space-y-1">
              <CardTitle>Maya Kim</CardTitle>
              <CardDescription>Product designer</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p>Leads the design system and the studio's onboarding.</p>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button variant="quiet">Message</Button>
            <Button variant="primary">Follow</Button>
          </CardFooter>
        </Card>
      </Skeleton>
      <Skeleton isLoading className="flex w-full max-w-80 flex-col gap-4">
        {["w-2/3", "w-1/2", "w-3/4", "w-3/5"].map((width) => (
          <div key={width} className="flex items-center gap-3">
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className={cn("h-3.5", width)} />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </Skeleton>
    </BoardSection>
  )
}

const BARS = [
  { label: "Uploading assets", value: 64 },
  { label: "Storage", value: 92 },
  { label: "Onboarding", value: 60, valueLabel: "3 of 5 steps" },
  { label: "Indexing", indeterminate: true },
]

function ProgressSection() {
  return (
    <BoardSection
      member="loading"
      title="Progress"
      axes={["progressTrack", "progressTrackStyle", "progressColor"]}
      className={STACK}
    >
      <div className="grid gap-x-12 gap-y-8 @xl:grid-cols-2">
        {BARS.map(({ label, value, valueLabel, indeterminate }) => (
          <ProgressBar
            key={label}
            value={value}
            valueLabel={valueLabel}
            isIndeterminate={indeterminate}
            className="w-full"
          >
            <div className="flex items-center justify-between gap-2">
              <Label>{label}</Label>
              {!indeterminate && <ProgressBarOutput />}
            </div>
            <ProgressBarControl />
          </ProgressBar>
        ))}
      </div>
    </BoardSection>
  )
}

export default function FeedbackBoard() {
  return (
    <Board id="feedback">
      <BadgeSection />
      <TagSection />
      <AlertSection />
      <ToastSection />
      <MotionSection />
      <SpinnerSection />
      <SkeletonSection />
      <ProgressSection />
    </Board>
  )
}
