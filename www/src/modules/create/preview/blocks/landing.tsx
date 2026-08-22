"use client"

import { useState } from "react"

import {
  ActivityIcon,
  ArrowRightIcon,
  BellIcon,
  BoxesIcon,
  ChartLineIcon,
  CheckIcon,
  CircleCheckIcon,
  ContainerIcon,
  GitBranchIcon,
  GlobeIcon,
  LayersIcon,
  MenuIcon,
  MessageSquareIcon,
  SendIcon,
  ServerIcon,
  ShapesIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  TelescopeIcon,
  TerminalIcon,
  TimerIcon,
  TrendingUpIcon,
  Users2Icon,
  ZapIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/registry/ui/alert"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/registry/ui/avatar"
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
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { Separator } from "@/registry/ui/separator"
import { Tab, TabList, TabPanel, Tabs } from "@/registry/ui/tabs"
import { TextField } from "@/registry/ui/text-field"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

/* --------------------------------- Content -------------------------------- */

const NAV_LINKS = ["Product", "Solutions", "Docs", "Pricing", "Changelog"]

const CUSTOMERS = [
  { name: "Loamworks", icon: ContainerIcon },
  { name: "Fernweh", icon: ShapesIcon },
  { name: "Cartogram", icon: GlobeIcon },
  { name: "Northsail", icon: LayersIcon },
  { name: "Peppercorn", icon: BoxesIcon },
  { name: "Vantage Rail", icon: ServerIcon },
]

type Feature = {
  icon: typeof ZapIcon
  title: string
  description: string
  points: string[]
}

const FEATURE_TABS: { id: string; label: string; features: Feature[] }[] = [
  {
    id: "engineering",
    label: "Engineering",
    features: [
      {
        icon: TerminalIcon,
        title: "Distributed tracing",
        description:
          "Follow a single request across every service, queue and database call without stitching logs by hand.",
        points: [
          "OpenTelemetry native",
          "14-day full-fidelity retention",
          "No sampling under 10k rps",
        ],
      },
      {
        icon: ActivityIcon,
        title: "Live service metrics",
        description:
          "Golden signals are computed at ingest, so a dashboard never lags behind the incident it is describing.",
        points: [
          "One-second resolution",
          "PromQL compatible",
          "Alert from any chart",
        ],
      },
      {
        icon: GitBranchIcon,
        title: "Deploy markers",
        description:
          "Every release lands on the timeline, so a regression points straight at the commit that shipped it.",
        points: [
          "GitHub and GitLab sync",
          "Automatic rollback hints",
          "Per-service changelogs",
        ],
      },
    ],
  },
  {
    id: "product",
    label: "Product",
    features: [
      {
        icon: ChartLineIcon,
        title: "Funnel analytics",
        description:
          "Measure the steps that matter with funnels built from the same events your engineers already emit.",
        points: [
          "Retroactive funnels",
          "Break down by any property",
          "Shareable saved views",
        ],
      },
      {
        icon: Users2Icon,
        title: "Cohorts",
        description:
          "Group accounts by behaviour and watch how each cohort responds to the release you just shipped.",
        points: [
          "Behavioural and firmographic",
          "Daily refresh",
          "Export to your warehouse",
        ],
      },
      {
        icon: TelescopeIcon,
        title: "Session inspector",
        description:
          "Replay a customer's path through the product with the matching trace attached to every step.",
        points: [
          "Trace-linked replays",
          "Automatic PII redaction",
          "Console and network capture",
        ],
      },
    ],
  },
  {
    id: "oncall",
    label: "On-call",
    features: [
      {
        icon: BellIcon,
        title: "Smarter paging",
        description:
          "Alerts group themselves by root cause, so one bad deploy wakes one engineer instead of the whole rota.",
        points: [
          "Cause-based grouping",
          "Escalation policies",
          "Slack and PagerDuty",
        ],
      },
      {
        icon: TimerIcon,
        title: "Incident timeline",
        description:
          "Deploys, alerts, and chat land on one timeline that writes most of the retrospective for you.",
        points: [
          "Auto-drafted postmortems",
          "Severity tracking",
          "MTTR by service",
        ],
      },
      {
        icon: ShieldCheckIcon,
        title: "SLO budgets",
        description:
          "Track error budgets per service and get told when burn rate turns a slow week into a real problem.",
        points: [
          "Multi-window burn alerts",
          "Budget forecasting",
          "Quarterly reports",
        ],
      },
    ],
  },
]

// The hero's mock trace waterfall — start/width are percentages of the request.
const TRACE_SPANS = [
  {
    name: "gateway.request",
    start: 0,
    width: 100,
    ms: "412ms",
    tone: "bg-primary",
  },
  {
    name: "auth.verify",
    start: 2,
    width: 9,
    ms: "37ms",
    tone: "bg-accent",
  },
  {
    name: "cart.load",
    start: 12,
    width: 14,
    ms: "58ms",
    tone: "bg-accent",
  },
  {
    name: "inventory.reserve",
    start: 27,
    width: 61,
    ms: "251ms",
    tone: "bg-warning",
  },
  {
    name: "payments.charge",
    start: 62,
    width: 22,
    ms: "91ms",
    tone: "bg-accent",
  },
  {
    name: "email.enqueue",
    start: 89,
    width: 8,
    ms: "33ms",
    tone: "bg-accent",
  },
]

const TESTIMONIALS = [
  {
    quote:
      "We cut our median time to root cause from about forty minutes to under a minute. The trace explorer is the first tool our on-call rota opens.",
    name: "Priya Raghunathan",
    role: "Staff Engineer, Loamworks",
    initials: "PR",
  },
  {
    quote:
      "Deploy markers on the same timeline as the alerts ended the arguing. You can see the exact release that moved the line.",
    name: "Daniel Okonkwo",
    role: "VP Engineering, Fernweh",
    initials: "DO",
  },
  {
    quote:
      "We replaced three tools with Arclight and still cut our observability bill by a third. Onboarding took an afternoon.",
    name: "Marta Villalobos",
    role: "Head of Platform, Cartogram",
    initials: "MV",
  },
]

const STATS = [
  { value: "4,200+", label: "Engineering teams shipping on Arclight" },
  { value: "1.4T", label: "Spans ingested every month" },
  { value: "38s", label: "Median time to root cause", delta: "-63%" },
  { value: "99.99%", label: "Ingest uptime, trailing 90 days" },
]

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: ["Tracing", "Metrics", "Logs", "Alerting", "Pricing"],
  },
  {
    title: "Developers",
    links: ["Documentation", "API reference", "SDKs", "Status", "Changelog"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Customers", "Security", "Blog"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "DPA", "Subprocessors"],
  },
]

/* -------------------------------- Primitives ------------------------------- */

function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span className="flex size-7 items-center justify-center rounded-md bg-primary text-fg-on-primary">
        <ZapIcon className="size-4" />
      </span>
      <span className="font-heading text-lg font-semibold tracking-tight">
        Arclight
      </span>
    </span>
  )
}

function Stars({ className }: { className?: string }) {
  return (
    <span
      className={cn("flex items-center gap-0.5 text-fg-warning", className)}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <StarIcon key={i} className="size-3.5 fill-current" />
      ))}
    </span>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
      <Badge variant="accent" appearance="subtle">
        {eyebrow}
      </Badge>
      <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      <p className="text-pretty text-fg-muted sm:text-lg">{description}</p>
    </div>
  )
}

function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <Card key={feature.title}>
          <CardHeader>
            <span className="mb-3 flex size-10 items-center justify-center rounded-lg bg-muted text-fg">
              <feature.icon className="size-5" />
            </span>
            <CardTitle className="text-lg">{feature.title}</CardTitle>
            <CardDescription className="text-pretty">
              {feature.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {feature.points.map((point) => (
                <li key={point} className="flex items-center gap-2 text-sm">
                  <CheckIcon className="size-4 shrink-0 text-fg-success" />
                  <span className="text-fg-muted">{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="link" size="sm">
              Explore
              <ArrowRightIcon />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

/* --------------------------------- Sections -------------------------------- */

function NavBar() {
  return (
    <header className="sticky top-0 z-20 border-b bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Wordmark />
        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Button key={link} variant="quiet" size="sm">
              {link}
            </Button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="quiet" size="sm" className="hidden sm:inline-flex">
            Sign in
          </Button>
          <Button variant="primary" size="sm">
            Start free
            <ArrowRightIcon />
          </Button>
          <Menu>
            <Button
              variant="quiet"
              size="sm"
              isIconOnly
              aria-label="Open menu"
              className="md:hidden"
            >
              <MenuIcon />
            </Button>
            <Popover placement="bottom end">
              <MenuContent>
                {NAV_LINKS.map((link) => (
                  <MenuItem key={link}>{link}</MenuItem>
                ))}
                <MenuItem>Sign in</MenuItem>
              </MenuContent>
            </Popover>
          </Menu>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-14 pb-16 sm:px-6 sm:pt-20 lg:px-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <Badge variant="accent" appearance="subtle" size="lg">
          <SparklesIcon />
          Arclight 3.0 — the trace explorer is live
          <ArrowRightIcon />
        </Badge>
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          Observability that fits in your head
        </h1>
        <p className="max-w-xl text-pretty text-fg-muted sm:text-lg">
          Traces, metrics and logs in one timeline — so the engineer who gets
          paged at 3am finds the cause before the coffee finishes brewing.
        </p>

        <form
          className="mt-2 flex w-full max-w-md flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault()
            setSubmitted(true)
          }}
        >
          <TextField
            aria-label="Work email"
            type="email"
            value={email}
            onChange={setEmail}
          >
            <InputGroup size="lg">
              <Input placeholder="you@company.com" />
              <InputGroupAddon>
                <Button type="submit" variant="primary">
                  Get started
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </TextField>
          {submitted ? (
            <Alert variant="success" className="text-left">
              <CircleCheckIcon />
              <AlertTitle>Workspace reserved</AlertTitle>
              <AlertDescription>
                We sent a setup link to {email || "your inbox"}. It expires in
                24 hours.
              </AlertDescription>
            </Alert>
          ) : (
            <p className="text-sm text-fg-muted">
              Free for 14 days · No credit card · SOC 2 Type II
            </p>
          )}
        </form>

        <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <AvatarGroup size="sm">
            <Avatar>
              <AvatarFallback>PR</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>DO</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>MV</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>JT</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>+4k</AvatarGroupCount>
          </AvatarGroup>
          <div className="flex items-center gap-2">
            <Stars />
            <span className="text-sm text-fg-muted">
              4.9 from 812 engineering teams
            </span>
          </div>
        </div>
      </div>

      {/* Product shot placeholder — no network images inside the preview. */}
      <div className="mt-14 rounded-2xl border bg-card p-2 shadow-sm">
        <div className="flex items-center gap-2 px-2 py-2">
          <span className="flex gap-1.5">
            <span className="size-2 rounded-full bg-border" />
            <span className="size-2 rounded-full bg-border" />
            <span className="size-2 rounded-full bg-border" />
          </span>
          <span className="ml-2 rounded-md bg-muted px-2 py-1 font-mono text-[10px] text-fg-muted">
            app.arclight.dev/traces
          </span>
          <Badge
            variant="success"
            appearance="subtle"
            size="sm"
            className="ml-auto"
          >
            Live
          </Badge>
        </div>
        <div className="flex flex-col gap-5 rounded-xl border bg-muted p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-heading text-lg font-medium">
              POST /v1/checkout
            </span>
            <Badge appearance="subtle" size="sm">
              trace 8f2c41
            </Badge>
            <Badge variant="warning" appearance="subtle" size="sm">
              412 ms
            </Badge>
            <span className="ml-auto text-sm text-fg-muted">17 spans</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {TRACE_SPANS.map((span) => (
              <div key={span.name} className="flex items-center gap-3">
                <span className="w-28 shrink-0 truncate font-mono text-xs text-fg-muted sm:w-44">
                  {span.name}
                </span>
                <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-neutral">
                  <span
                    className={cn("absolute inset-y-0 rounded-full", span.tone)}
                    style={{ left: `${span.start}%`, width: `${span.width}%` }}
                  />
                </span>
                <span className="w-12 shrink-0 text-right font-mono text-xs text-fg-muted tabular-nums">
                  {span.ms}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t pt-4 text-sm text-fg-muted">
            <TimerIcon className="size-4 shrink-0" />
            <span className="text-pretty">
              inventory.reserve held the request for 61% of its total time
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function CustomerStrip() {
  return (
    <section className="border-y bg-card/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-center font-mono text-xs tracking-widest text-fg-muted uppercase">
          Trusted by engineering teams at
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {CUSTOMERS.map((customer) => (
            <span
              key={customer.name}
              className="flex items-center gap-2 text-fg-muted"
            >
              <customer.icon className="size-5" />
              <span className="font-heading text-lg font-semibold tracking-tight">
                {customer.name}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-16 pb-12 sm:px-6 sm:pt-24 sm:pb-16 lg:px-8">
      <SectionHeading
        eyebrow="Platform"
        title="One timeline for everyone who ships"
        description="The same event stream powers engineering, product and on-call — so nobody argues about whose dashboard is right."
      />
      <Tabs defaultSelectedKey="engineering" className="mt-10">
        <TabList variant="line" aria-label="Who it is for" className="mx-auto">
          {FEATURE_TABS.map((tab) => (
            <Tab key={tab.id} id={tab.id}>
              {tab.label}
            </Tab>
          ))}
        </TabList>
        {FEATURE_TABS.map((tab) => (
          <TabPanel key={tab.id} id={tab.id} className="pt-8">
            <FeatureGrid features={tab.features} />
          </TabPanel>
        ))}
      </Tabs>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <SectionHeading
        eyebrow="Customers"
        title="Fewer dashboards, shorter incidents"
        description="What platform teams say after their first quarter on Arclight."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((testimonial) => (
          <Card key={testimonial.name}>
            <CardContent className="flex flex-col gap-4">
              <Stars />
              <blockquote className="text-pretty">
                “{testimonial.quote}”
              </blockquote>
            </CardContent>
            <CardFooter className="gap-3 border-t">
              <Avatar>
                <AvatarFallback>{testimonial.initials}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">
                  {testimonial.name}
                </span>
                <span className="text-sm text-fg-muted">
                  {testimonial.role}
                </span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border lg:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-2 bg-card p-6 sm:p-8"
          >
            <div className="flex items-center gap-2">
              <span className="font-heading text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
                {stat.value}
              </span>
              {stat.delta ? (
                <Badge variant="success" appearance="subtle" size="sm">
                  <TrendingUpIcon />
                  {stat.delta}
                </Badge>
              ) : null}
            </div>
            <p className="text-sm text-pretty text-fg-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function CtaBanner() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-border-accent bg-accent-muted px-6 py-12 text-center sm:px-12 sm:py-16">
        <h2 className="max-w-2xl font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Point one service at Arclight this afternoon
        </h2>
        <p className="max-w-xl text-pretty text-fg-muted sm:text-lg">
          Drop in the OpenTelemetry endpoint, ship a deploy, and watch the first
          traces arrive in under five minutes.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="primary" size="lg">
            Start free trial
            <ArrowRightIcon />
          </Button>
          <Button size="lg">Book a walkthrough</Button>
        </div>
        <p className="text-sm text-fg-muted">
          14-day trial · Migrate from Datadog or Honeycomb with our importer
        </p>
      </div>
    </section>
  )
}

function Footer() {
  const socials = [
    { icon: GitBranchIcon, label: "Source" },
    { icon: MessageSquareIcon, label: "Community" },
    { icon: SendIcon, label: "Newsletter" },
  ]

  return (
    <footer className="border-t bg-card/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Wordmark />
            <p className="max-w-xs text-sm text-pretty text-fg-muted">
              Traces, metrics and logs in one timeline. Built in Lisbon and
              Montréal.
            </p>
            <Badge variant="success" appearance="subtle" className="self-start">
              <span className="size-1.5 rounded-full bg-success" />
              All systems operational
            </Badge>
          </div>
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <span className="text-sm font-medium">{column.title}</span>
              <ul className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-fg-muted hover:text-fg">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-fg-muted">
            © 2026 Arclight Labs, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            {socials.map((social) => (
              <Tooltip key={social.label}>
                <Button
                  variant="quiet"
                  size="sm"
                  isIconOnly
                  aria-label={social.label}
                >
                  <social.icon />
                </Button>
                <TooltipContent>{social.label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function LandingBlock() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <NavBar />
      <main>
        <Hero />
        <CustomerStrip />
        <Features />
        <Testimonials />
        <Stats />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  )
}
