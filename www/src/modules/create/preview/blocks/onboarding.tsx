"use client"

import { useState } from "react"

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Building2Icon,
  CheckIcon,
  CircleCheckIcon,
  CreditCardIcon,
  ImageUpIcon,
  InfoIcon,
  PlusIcon,
  Trash2Icon,
  UploadIcon,
  UserIcon,
  Users2Icon,
  ZapIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar"
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
import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/ui/empty"
import {
  Description,
  FieldContent,
  FieldGroup,
  Label,
} from "@/registry/ui/field"
import { FileTrigger } from "@/registry/ui/file-trigger"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioIndicator,
} from "@/registry/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
import { Separator } from "@/registry/ui/separator"
import { TextField } from "@/registry/ui/text-field"

const STEPS = [
  {
    id: "profile",
    title: "Profile",
    heading: "Tell us who you are",
    description: "This is how teammates will see you across Ridgeline.",
  },
  {
    id: "workspace",
    title: "Workspace",
    heading: "Name your workspace",
    description: "Everything — dashboards, funnels, alerts — lives inside it.",
  },
  {
    id: "plan",
    title: "Plan",
    heading: "Pick a plan",
    description: "Every plan starts with a 14-day trial. Switch any time.",
  },
  {
    id: "invite",
    title: "Invite",
    heading: "Bring your team in",
    description: "Invite the people who will read the numbers with you.",
  },
] as const

const TEAM_SIZES = [
  { id: "solo", label: "Just me" },
  { id: "small", label: "2–10" },
  { id: "mid", label: "11–50" },
  { id: "large", label: "51+" },
]

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "$0",
    unit: "/month",
    description: "3 dashboards, 30-day retention, 1 seat.",
    badge: null,
  },
  {
    id: "team",
    name: "Team",
    price: "$28",
    unit: "/seat/month",
    description: "Unlimited dashboards, funnels, cohorts and shared alerts.",
    badge: { label: "Most popular", variant: "accent" as const },
  },
  {
    id: "scale",
    name: "Scale",
    price: "$64",
    unit: "/seat/month",
    description: "SAML SSO, audit log, warehouse sync and a named CSM.",
    badge: { label: "SSO included", variant: "neutral" as const },
  },
]

const ROLES = [
  { id: "admin", label: "Admin" },
  { id: "editor", label: "Editor" },
  { id: "viewer", label: "Viewer" },
]

interface Invite {
  id: number
  email: string
  role: string
}

const INITIAL_INVITES: Invite[] = [
  { id: 1, email: "priya.raman@northwind.studio", role: "editor" },
  { id: 2, email: "tomas.lindqvist@northwind.studio", role: "viewer" },
]

export default function OnboardingBlock() {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  const [firstName, setFirstName] = useState("Maya")
  const [lastName, setLastName] = useState("Okonkwo")
  const [jobTitle, setJobTitle] = useState("Head of product design")
  const [avatar, setAvatar] = useState<string | null>(null)

  const [workspace, setWorkspace] = useState("Northwind Studio")
  const [slug, setSlug] = useState("northwind")
  const [teamSize, setTeamSize] = useState("small")

  const [plan, setPlan] = useState("team")

  const [invites, setInvites] = useState<Invite[]>(INITIAL_INVITES)
  const [notify, setNotify] = useState(true)

  const current = STEPS[step]!
  const isLast = step === STEPS.length - 1
  const filledInvites = invites.filter((i) => i.email.trim() !== "").length
  const planName = PLANS.find((p) => p.id === plan)?.name ?? "Team"
  const teamSizeLabel =
    TEAM_SIZES.find((t) => t.id === teamSize)?.label ?? "2–10"

  const initials =
    `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase()

  const updateInvite = (id: number, patch: Partial<Invite>) => {
    setInvites((prev) =>
      prev.map((invite) =>
        invite.id === id ? { ...invite, ...patch } : invite,
      ),
    )
  }

  const restart = () => {
    setDone(false)
    setStep(0)
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-10 border-b bg-bg/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4">
          <span className="grid size-7 shrink-0 place-content-center rounded-md bg-primary text-fg-on-primary">
            <ZapIcon size={16} />
          </span>
          <span className="font-heading font-semibold tracking-tight">
            Ridgeline
          </span>
          <span className="ml-auto text-sm text-fg-muted tabular-nums">
            {done ? "Setup complete" : `Step ${step + 1} of ${STEPS.length}`}
          </span>
          <Button variant="quiet" size="sm">
            Save &amp; exit
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
        {done ? (
          <FinishCard
            workspace={workspace}
            slug={slug}
            planName={planName}
            teamSizeLabel={teamSizeLabel}
            inviteCount={filledInvites}
            onRestart={restart}
          />
        ) : (
          <div className="flex flex-col gap-6">
            <StepIndicator step={step} onSelect={setStep} />

            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-xl">{current.heading}</CardTitle>
                <CardDescription>{current.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {current.id === "profile" && (
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-wrap items-center gap-4">
                      <Avatar size="lg" className="size-16">
                        {avatar && <AvatarImage src={avatar} alt="" />}
                        <AvatarFallback className="text-base">
                          {initials || <ImageUpIcon className="size-5" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <FileTrigger
                            acceptedFileTypes={["image/png", "image/jpeg"]}
                            onSelect={(files) => {
                              const file = files ? Array.from(files)[0] : null
                              if (file) setAvatar(URL.createObjectURL(file))
                            }}
                          >
                            <Button variant="secondary" size="sm">
                              <UploadIcon />
                              {avatar ? "Change photo" : "Upload photo"}
                            </Button>
                          </FileTrigger>
                          {avatar && (
                            <Button
                              variant="quiet"
                              size="sm"
                              onPress={() => setAvatar(null)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-fg-muted">
                          PNG or JPG, square works best. Up to 2MB.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <TextField value={firstName} onChange={setFirstName}>
                        <Label>First name</Label>
                        <Input placeholder="Maya" />
                      </TextField>
                      <TextField value={lastName} onChange={setLastName}>
                        <Label>Last name</Label>
                        <Input placeholder="Okonkwo" />
                      </TextField>
                    </div>

                    <TextField value={jobTitle} onChange={setJobTitle}>
                      <Label>What do you do?</Label>
                      <Input placeholder="Head of product design" />
                      <Description>
                        Shown next to your name on comments and shared reports.
                      </Description>
                    </TextField>
                  </div>
                )}

                {current.id === "workspace" && (
                  <div className="flex flex-col gap-6">
                    <TextField value={workspace} onChange={setWorkspace}>
                      <Label>Workspace name</Label>
                      <Input placeholder="Northwind Studio" />
                    </TextField>

                    <TextField value={slug} onChange={setSlug}>
                      <Label>Workspace URL</Label>
                      <InputGroup>
                        <InputGroupAddon>ridgeline.app/</InputGroupAddon>
                        <Input placeholder="northwind" />
                      </InputGroup>
                      <Description>
                        Lowercase letters, numbers and dashes. You can change it
                        later.
                      </Description>
                    </TextField>

                    <RadioGroup value={teamSize} onChange={setTeamSize}>
                      <Label>How many people will use Ridgeline?</Label>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {TEAM_SIZES.map((size) => (
                          <Radio key={size.id} value={size.id}>
                            <RadioControl className="justify-center">
                              <Label>{size.label}</Label>
                            </RadioControl>
                          </Radio>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {current.id === "plan" && (
                  <div className="flex flex-col gap-4">
                    <RadioGroup
                      aria-label="Plan"
                      value={plan}
                      onChange={setPlan}
                    >
                      <FieldGroup>
                        {PLANS.map((item) => (
                          <Radio key={item.id} value={item.id}>
                            <RadioControl>
                              <RadioIndicator />
                              <FieldContent className="flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <Label>{item.name}</Label>
                                  {item.badge && (
                                    <Badge
                                      variant={item.badge.variant}
                                      appearance="subtle"
                                      size="sm"
                                    >
                                      {item.badge.label}
                                    </Badge>
                                  )}
                                  <span className="ml-auto flex items-baseline gap-0.5">
                                    <span className="font-medium tabular-nums">
                                      {item.price}
                                    </span>
                                    <span className="text-xs text-fg-muted">
                                      {item.unit}
                                    </span>
                                  </span>
                                </div>
                                <Description>{item.description}</Description>
                              </FieldContent>
                            </RadioControl>
                          </Radio>
                        ))}
                      </FieldGroup>
                    </RadioGroup>

                    <div className="flex items-start gap-2 rounded-md bg-muted p-3 text-sm text-fg-muted">
                      <InfoIcon size={16} className="mt-0.5 shrink-0" />
                      <p>
                        No card required today. We&apos;ll email you three days
                        before the trial ends.
                      </p>
                    </div>
                  </div>
                )}

                {current.id === "invite" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3">
                      {invites.map((invite, index) => (
                        <div key={invite.id} className="flex items-end gap-2">
                          <TextField
                            aria-label={`Teammate ${index + 1} email`}
                            className="min-w-0 flex-1"
                            value={invite.email}
                            onChange={(value) =>
                              updateInvite(invite.id, { email: value })
                            }
                          >
                            <Input
                              type="email"
                              placeholder="teammate@northwind.studio"
                            />
                          </TextField>
                          <Select
                            aria-label={`Teammate ${index + 1} role`}
                            className="w-26 shrink-0 sm:w-32"
                            value={invite.role}
                            onChange={(key) =>
                              updateInvite(invite.id, { role: String(key) })
                            }
                          >
                            <SelectTrigger />
                            <SelectContent>
                              {ROLES.map((role) => (
                                <SelectItem key={role.id} id={role.id}>
                                  {role.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="quiet"
                            isIconOnly
                            aria-label={`Remove teammate ${index + 1}`}
                            isDisabled={invites.length === 1}
                            onPress={() =>
                              setInvites((prev) =>
                                prev.filter((i) => i.id !== invite.id),
                              )
                            }
                          >
                            <Trash2Icon />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="secondary"
                      className="w-full"
                      onPress={() =>
                        setInvites((prev) => [
                          ...prev,
                          {
                            id: Math.max(0, ...prev.map((i) => i.id)) + 1,
                            email: "",
                            role: "viewer",
                          },
                        ])
                      }
                    >
                      <PlusIcon />
                      Add another
                    </Button>

                    <Checkbox isSelected={notify} onChange={setNotify}>
                      <CheckboxControl />
                      <Label>
                        Send a short intro to Ridgeline with each invite
                      </Label>
                    </Checkbox>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex-wrap justify-between gap-2 border-t">
                <Button
                  variant="secondary"
                  isDisabled={step === 0}
                  onPress={() => setStep((s) => Math.max(0, s - 1))}
                >
                  <ArrowLeftIcon />
                  Back
                </Button>
                <div className="flex flex-1 items-center justify-end gap-2">
                  {isLast && (
                    <Button variant="quiet" onPress={() => setDone(true)}>
                      Skip for now
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    onPress={() =>
                      isLast ? setDone(true) : setStep((s) => s + 1)
                    }
                  >
                    {isLast ? "Create workspace" : "Continue"}
                    {!isLast && <ArrowRightIcon />}
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <p className="text-center text-sm text-fg-muted">
              Need a hand? Email{" "}
              <a
                href="#"
                className="text-fg-accent underline underline-offset-4"
              >
                setup@ridgeline.app
              </a>
              .
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

const STEP_ICONS = [UserIcon, Building2Icon, CreditCardIcon, Users2Icon]

function StepIndicator({
  step,
  onSelect,
}: {
  step: number
  onSelect: (index: number) => void
}) {
  return (
    <nav aria-label="Onboarding steps">
      <ol className="flex items-center">
        {STEPS.map((item, index) => {
          const Icon = STEP_ICONS[index]!
          const isComplete = index < step
          const isCurrent = index === step
          return (
            <li
              key={item.id}
              className={cn(
                "flex min-w-0 items-center",
                index < STEPS.length - 1 && "flex-1",
              )}
            >
              <Button
                variant="quiet"
                size="sm"
                className="gap-2 px-1.5"
                onPress={() => onSelect(index)}
              >
                <span
                  className={cn(
                    "grid size-5.5 shrink-0 place-content-center rounded-full border text-[0.6875rem] font-medium tabular-nums",
                    isCurrent && "border-primary bg-primary text-fg-on-primary",
                    isComplete && "border-primary/25 bg-primary-muted text-fg",
                    !isCurrent && !isComplete && "text-fg-muted",
                  )}
                >
                  {isComplete ? <CheckIcon size={12} /> : index + 1}
                </span>
                <Icon size={14} className="text-fg-muted sm:hidden" />
                <span
                  className={cn(
                    "hidden truncate text-sm sm:inline",
                    isCurrent ? "font-medium text-fg" : "text-fg-muted",
                  )}
                >
                  {item.title}
                </span>
              </Button>
              {index < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "mx-1 h-px min-w-2 flex-1",
                    isComplete ? "bg-primary/40" : "bg-border",
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function FinishCard({
  workspace,
  slug,
  planName,
  teamSizeLabel,
  inviteCount,
  onRestart,
}: {
  workspace: string
  slug: string
  planName: string
  teamSizeLabel: string
  inviteCount: number
  onRestart: () => void
}) {
  const summary = [
    { label: "Workspace", value: `ridgeline.app/${slug}` },
    { label: "Plan", value: `${planName} · 14-day trial` },
    { label: "Team size", value: teamSizeLabel },
    {
      label: "Invites sent",
      value: inviteCount === 1 ? "1 teammate" : `${inviteCount} teammates`,
    },
  ]

  return (
    <Card>
      <CardContent>
        <Empty>
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="bg-success-muted text-fg-success"
            >
              <CircleCheckIcon />
            </EmptyMedia>
            <EmptyTitle>{workspace} is ready</EmptyTitle>
            <EmptyDescription>
              Drop the Ridgeline snippet into your app and the first events show
              up in under a minute.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="primary">Open workspace</Button>
              <Button variant="secondary" onPress={onRestart}>
                Review setup
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </CardContent>
      <Separator />
      <CardContent>
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {summary.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-3 text-sm"
            >
              <dt className="text-fg-muted">{row.label}</dt>
              <dd className="truncate font-medium">{row.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
