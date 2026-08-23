"use client"

import { useState } from "react"

import {
  ActivityIcon,
  ArrowRightIcon,
  BoxesIcon,
  Building2Icon,
  CheckIcon,
  ContainerIcon,
  GlobeIcon,
  HelpCircleIcon,
  LayersIcon,
  MinusIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  ZapIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Accordion } from "@/registry/ui/accordion"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import {
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
} from "@/registry/ui/disclosure"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import { Separator } from "@/registry/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

/* Pricing page for "Cadence", a product-analytics SaaS. */

type Period = "monthly" | "yearly"

interface Plan {
  id: string
  name: string
  tagline: string
  monthly: number
  yearly: number
  cta: string
  seats: string
  features: string[]
  popular?: boolean
}

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For solo builders shipping their first product.",
    monthly: 0,
    yearly: 0,
    cta: "Start for free",
    seats: "1 editor seat",
    features: [
      "Up to 3 projects",
      "10k tracked events / month",
      "7-day event history",
      "Core dashboards",
      "Community support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For teams that ship every week.",
    monthly: 24,
    yearly: 19,
    cta: "Start 14-day trial",
    popular: true,
    seats: "Up to 10 editor seats",
    features: [
      "Unlimited projects",
      "1M tracked events / month",
      "12-month event history",
      "Funnels, cohorts and retention",
      "Slack and Linear integrations",
      "Email and chat support",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    tagline: "For orgs running many teams under one roof.",
    monthly: 79,
    yearly: 63,
    cta: "Start 14-day trial",
    seats: "Unlimited editor seats",
    features: [
      "Everything in Growth",
      "10M tracked events / month",
      "36-month event history",
      "SAML SSO and SCIM provisioning",
      "Audit log and data residency",
      "99.9% uptime SLA",
    ],
  },
]

const customers = [
  { name: "Northwind", icon: LayersIcon },
  { name: "Kestrel", icon: BoxesIcon },
  { name: "Halcyon", icon: ZapIcon },
  { name: "Fernway", icon: GlobeIcon },
  { name: "Orbit Labs", icon: ContainerIcon },
]

type CellValue = boolean | string

const comparison: {
  group: string
  rows: { feature: string; values: [CellValue, CellValue, CellValue] }[]
}[] = [
  {
    group: "Usage",
    rows: [
      { feature: "Projects", values: ["3", "Unlimited", "Unlimited"] },
      { feature: "Editor seats", values: ["1", "10", "Unlimited"] },
      { feature: "Tracked events / month", values: ["10k", "1M", "10M"] },
      {
        feature: "Event history",
        values: ["7 days", "12 months", "36 months"],
      },
      { feature: "Data export", values: [false, "CSV", "CSV + warehouse"] },
    ],
  },
  {
    group: "Analytics",
    rows: [
      { feature: "Dashboards", values: [true, true, true] },
      { feature: "Funnels and retention", values: [false, true, true] },
      { feature: "Cohort builder", values: [false, true, true] },
      { feature: "Session replay", values: [false, true, true] },
      { feature: "Warehouse sync", values: [false, false, true] },
    ],
  },
  {
    group: "Collaboration",
    rows: [
      { feature: "Shared workspaces", values: [true, true, true] },
      { feature: "Slack and Linear", values: [false, true, true] },
      { feature: "Scheduled reports", values: [false, true, true] },
      { feature: "Custom roles", values: [false, false, true] },
    ],
  },
  {
    group: "Security and support",
    rows: [
      { feature: "SAML SSO", values: [false, false, true] },
      { feature: "SCIM provisioning", values: [false, false, true] },
      { feature: "Audit log", values: [false, false, true] },
      {
        feature: "Support",
        values: ["Community", "Email and chat", "Priority + CSM"],
      },
      { feature: "Uptime SLA", values: [false, false, "99.9%"] },
    ],
  },
]

const faqs = [
  {
    id: "trial",
    question: "What happens after the 14-day trial?",
    answer:
      "Your workspace drops to the Starter plan and keeps every dashboard you built — we only pause the paid features. Add a card at any point during or after the trial and the workspace picks up exactly where it left off.",
  },
  {
    id: "events",
    question: "How are tracked events counted?",
    answer:
      "One event is one action you send to Cadence — a page view, a signup, a checkout. Identify calls and property updates are free. We show live usage in the workspace, and we email you at 80% of your monthly allowance.",
  },
  {
    id: "overage",
    question: "What if we go over our event allowance?",
    answer:
      "Nothing breaks. We keep ingesting and bill overage at $0.40 per extra 10k events on Growth and $0.25 on Scale. If you go over three months in a row we'll suggest the plan that actually costs you less.",
  },
  {
    id: "seats",
    question: "How do seats work?",
    answer:
      "Only editors take a seat. Viewers — anyone reading dashboards or receiving scheduled reports — are unlimited on every paid plan. Seat changes are prorated to the day on your next invoice.",
  },
  {
    id: "switch",
    question: "Can we switch between monthly and annual billing?",
    answer:
      "Yes, in Settings → Billing. Moving to annual credits the unused part of your current month; moving back to monthly takes effect at the end of the annual term.",
  },
  {
    id: "migrate",
    question: "Can you help us migrate historical data?",
    answer:
      "Scale plans include a guided migration: we backfill up to 36 months from Amplitude, Mixpanel, Segment or a warehouse table, and rebuild your core dashboards with you. It usually takes under two weeks.",
  },
]

function Price({ plan, period }: { plan: Plan; period: Period }) {
  const amount = period === "yearly" ? plan.yearly : plan.monthly

  if (amount === 0) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-1.5">
          <span className="font-heading text-4xl font-semibold tracking-tight tabular-nums">
            $0
          </span>
          <span className="text-sm text-fg-muted">forever</span>
        </div>
        <p className="text-sm text-fg-muted">No card required</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-1.5">
        <span className="font-heading text-4xl font-semibold tracking-tight tabular-nums">
          ${amount}
        </span>
        <span className="text-sm text-fg-muted">per seat / month</span>
      </div>
      <p className="text-sm text-fg-muted tabular-nums">
        {period === "yearly"
          ? `Billed annually — $${plan.yearly * 12} per seat / year`
          : `Billed monthly — $${plan.monthly} per seat`}
      </p>
    </div>
  )
}

function ComparisonCell({ value }: { value: CellValue }) {
  if (value === true) {
    return (
      <>
        <CheckIcon aria-hidden className="mx-auto size-4 text-fg-success" />
        <span className="sr-only">Included</span>
      </>
    )
  }
  if (value === false) {
    return (
      <>
        <MinusIcon aria-hidden className="mx-auto size-4 text-fg-muted/60" />
        <span className="sr-only">Not included</span>
      </>
    )
  }
  return <span className="tabular-nums">{value}</span>
}

export default function PricingBlock() {
  const [period, setPeriod] = useState<Period>("yearly")

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b border-border-muted bg-bg/85 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-fg-on-primary">
              <ActivityIcon className="size-4" />
            </span>
            <span className="font-heading text-sm font-semibold tracking-tight">
              Cadence
            </span>
          </div>
          <nav className="ml-4 hidden items-center gap-1 md:flex">
            {["Product", "Customers", "Docs", "Changelog"].map((item) => (
              <Button key={item} variant="quiet" size="sm">
                {item}
              </Button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="quiet" size="sm" className="hidden sm:inline-flex">
              Sign in
            </Button>
            <Button variant="primary" size="sm">
              Start free
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="flex flex-col items-center gap-6 py-14 text-center sm:py-20">
          <Badge variant="accent" appearance="subtle" size="lg">
            <SparklesIcon />
            Session replay now on every paid plan
          </Badge>
          <h1 className="max-w-3xl font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Analytics your whole team will actually open
          </h1>
          <p className="max-w-xl text-pretty text-fg-muted sm:text-lg">
            Cadence turns product events into answers in seconds. Start free,
            add seats as the team grows, and never get billed for a dashboard
            nobody reads.
          </p>
          <div className="flex flex-col items-center gap-3 pt-2">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <SegmentedControl
                aria-label="Billing period"
                selectedKeys={[period]}
                onSelectionChange={(keys) => {
                  const next = [...keys][0]
                  if (next === "monthly" || next === "yearly") setPeriod(next)
                }}
              >
                <SegmentedControlItem id="monthly">
                  Monthly
                </SegmentedControlItem>
                <SegmentedControlItem id="yearly">Yearly</SegmentedControlItem>
              </SegmentedControl>
              <Badge variant="success" appearance="subtle" size="lg">
                Save 20%
              </Badge>
              <Tooltip>
                <Button
                  variant="quiet"
                  size="sm"
                  isIconOnly
                  aria-label="How annual billing works"
                >
                  <HelpCircleIcon />
                </Button>
                <TooltipContent>
                  Annual plans are billed once up front and work out at two
                  months free.
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-sm text-fg-muted">
              Prices in USD. Cancel or change plan at any time.
            </p>
          </div>
        </section>

        {/* Plans */}
        <section className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "h-full",
                plan.popular && "border-2 border-border-accent",
              )}
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.tagline}</CardDescription>
                {plan.popular && (
                  <CardAction>
                    <Badge variant="accent" size="sm">
                      Most popular
                    </Badge>
                  </CardAction>
                )}
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-5">
                <Price plan={plan} period={period} />
                <Separator />
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-medium tracking-widest text-fg-muted uppercase">
                    {plan.seats}
                  </p>
                  <ul className="flex flex-col gap-2.5 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckIcon
                          aria-hidden
                          className={cn(
                            "mt-0.5 size-4 shrink-0",
                            plan.popular ? "text-fg-accent" : "text-fg-muted",
                          )}
                        />
                        <span className="text-pretty">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant={plan.popular ? "primary" : "secondary"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </section>

        {/* Enterprise */}
        <section className="pt-4">
          <Card>
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-fg-muted">
                <Building2Icon className="size-5" />
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <p className="font-heading font-medium">Enterprise</p>
                <p className="text-sm text-pretty text-fg-muted">
                  Volume pricing, dedicated infrastructure, custom data
                  retention, and a security review with our team.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 sm:ml-auto">
                <Button variant="secondary">
                  <ShieldCheckIcon />
                  Security overview
                </Button>
                <Button variant="primary">
                  Talk to sales
                  <ArrowRightIcon />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Social proof */}
        <section className="flex flex-col gap-5 py-14">
          <p className="text-center text-xs font-medium tracking-widest text-fg-muted uppercase">
            Trusted by 4,200 product teams
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {customers.map((customer) => (
              <div
                key={customer.name}
                className="flex h-16 items-center justify-center gap-2 rounded-md bg-muted text-fg-muted"
              >
                <customer.icon className="size-4" />
                <span className="text-sm font-medium">{customer.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Compare every plan
            </h2>
            <p className="max-w-xl text-pretty text-fg-muted">
              The full breakdown — usage limits, analytics depth, collaboration
              and the security controls your IT team will ask about.
            </p>
          </div>
          <TableContainer>
            <Table
              aria-label="Plan comparison"
              className="w-full min-w-[42rem]"
            >
              <TableHeader>
                <TableColumn isRowHeader className="w-[34%]">
                  Feature
                </TableColumn>
                {plans.map((plan) => (
                  <TableColumn key={plan.id} className="text-center">
                    {plan.name}
                  </TableColumn>
                ))}
              </TableHeader>
              <TableBody>
                {comparison.flatMap((section) => [
                  <TableRow key={section.group} id={`group-${section.group}`}>
                    <TableCell
                      colSpan={4}
                      className="bg-muted/60 text-xs font-medium tracking-widest text-fg-muted uppercase"
                    >
                      {section.group}
                    </TableCell>
                  </TableRow>,
                  ...section.rows.map((row) => (
                    <TableRow key={row.feature} id={row.feature}>
                      <TableCell className="font-medium text-fg">
                        {row.feature}
                      </TableCell>
                      {row.values.map((value, index) => (
                        <TableCell
                          key={plans[index]?.id ?? index}
                          className="text-center text-fg-muted"
                          textValue={
                            typeof value === "string"
                              ? value
                              : value
                                ? "Included"
                                : "Not included"
                          }
                        >
                          <ComparisonCell value={value} />
                        </TableCell>
                      ))}
                    </TableRow>
                  )),
                ])}
              </TableBody>
            </Table>
          </TableContainer>
        </section>

        {/* Testimonial */}
        <section className="py-14">
          <Card>
            <CardContent className="flex flex-col gap-5">
              <div className="flex items-center gap-0.5 text-fg-warning">
                {[0, 1, 2, 3, 4].map((i) => (
                  <StarIcon key={i} aria-hidden className="size-4" />
                ))}
                <span className="sr-only">Rated 5 out of 5</span>
              </div>
              <blockquote className="max-w-3xl text-lg leading-relaxed text-pretty">
                “We moved 38 people off a warehouse dashboard nobody trusted.
                Cadence paid for itself the first week — our activation funnel
                finally matched what support was telling us.”
              </blockquote>
              <div className="flex flex-wrap items-center gap-3">
                <Avatar size="lg">
                  <AvatarFallback>MR</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Maya Renard</span>
                  <span className="text-sm text-fg-muted">
                    VP Product, Northwind
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section className="grid gap-6 lg:grid-cols-[18rem_1fr] lg:gap-10">
          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Questions, answered
            </h2>
            <p className="text-pretty text-fg-muted">
              Still unsure which plan fits? Email{" "}
              <span className="text-fg">sales@cadence.io</span> — a real person
              replies within one business day.
            </p>
          </div>
          <Accordion defaultExpandedKeys={["trial"]} className="w-full min-w-0">
            {faqs.map((faq) => (
              <Disclosure key={faq.id} id={faq.id}>
                <DisclosureTrigger className="text-left">
                  {faq.question}
                </DisclosureTrigger>
                <DisclosurePanel className="max-w-2xl text-sm text-pretty text-fg-muted">
                  {faq.answer}
                </DisclosurePanel>
              </Disclosure>
            ))}
          </Accordion>
        </section>

        {/* Closing CTA */}
        <section className="mt-16 flex flex-col items-center gap-5 rounded-xl border border-border-muted bg-card px-6 py-14 text-center">
          <h2 className="max-w-xl font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            Ship your first dashboard this afternoon
          </h2>
          <p className="max-w-md text-pretty text-fg-muted">
            Install the SDK, send one event, and Cadence builds your activation
            funnel for you. No sales call to get started.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="primary" size="lg">
              Start 14-day trial
            </Button>
            <Button variant="secondary" size="lg">
              Book a walkthrough
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border-muted">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p className="text-sm text-fg-muted">
            © 2026 Cadence Analytics, Inc.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-fg-muted sm:ml-auto">
            {["Status", "Security", "Terms", "Privacy"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
