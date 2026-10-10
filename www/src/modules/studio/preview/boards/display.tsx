"use client"

import { useEffect, useState } from "react"
import type { Key } from "react-aria-components"

import { SearchIcon } from "@/registry/icons"
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/registry/ui/accordion"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
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
import { Kbd, KbdGroup } from "@/registry/ui/kbd"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"
import { TextField } from "@/registry/ui/text-field"

import { Board, BoardSection, CAPTION, useBoardFocus } from "./board"

const STACK =
  "@container flex-col flex-nowrap items-stretch justify-start gap-10"

const ISSUES = [
  {
    id: "ENG-412",
    title: "Stripe migration",
    status: ["In progress", "warning"],
    updated: "2h ago",
  },
  {
    id: "ENG-398",
    title: "Dark mode settings",
    status: ["Done", "success"],
    updated: "Yesterday",
  },
  {
    id: "ENG-405",
    title: "Flaky Safari test",
    status: ["Blocked", "danger"],
    updated: "Oct 3",
  },
  {
    id: "ENG-417",
    title: "API rate limits",
    status: ["Todo", "neutral"],
    updated: "Oct 1",
  },
] as const

// Phones keep the title and status; titles wrap so wide badges still fit.
const WIDE = "hidden @md:table-cell"
const WIDER = "hidden @lg:table-cell"
const TITLE = "font-medium whitespace-normal @sm:whitespace-nowrap"

function TableSection() {
  return (
    <BoardSection
      member="table"
      title="Table"
      axes={["tableHeader", "tableHeaderLabel", "tableMotion", "selectedWash"]}
      className={STACK}
    >
      <TableContainer>
        <Table
          aria-label="Issues"
          selectionMode="multiple"
          defaultSelectedKeys={["ENG-398"]}
        >
          <TableHeader>
            <TableColumn className={WIDE}>Issue</TableColumn>
            <TableColumn isRowHeader>Title</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn className={`text-right ${WIDER}`}>Updated</TableColumn>
          </TableHeader>
          <TableBody>
            {ISSUES.map((issue) => (
              <TableRow key={issue.id} id={issue.id}>
                <TableCell className={`text-fg-muted tabular-nums ${WIDE}`}>
                  {issue.id}
                </TableCell>
                <TableCell className={TITLE}>{issue.title}</TableCell>
                <TableCell>
                  <Badge variant={issue.status[1]}>{issue.status[0]}</Badge>
                </TableCell>
                <TableCell className={`text-right text-fg-muted ${WIDER}`}>
                  {issue.updated}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </BoardSection>
  )
}

const QUESTIONS = [
  {
    id: "plans",
    question: "Can I change plans later?",
    answer:
      "Yes. Upgrades apply right away; downgrades take effect at the end of the billing cycle.",
  },
  {
    id: "seats",
    question: "How are seats counted?",
    answer:
      "Every member with access to a workspace takes a seat. Guests are free.",
  },
  {
    id: "refunds",
    question: "Do you offer refunds?",
    answer: "Annual plans can be refunded within 30 days of purchase.",
  },
]

const REPLAY_MS = 1400

/** Opens and closes on its own while the panel edits its motion. */
function AccordionSection() {
  const { axis } = useBoardFocus()
  const playing = axis === "accordionMotion"
  const [expanded, setExpanded] = useState<Set<Key>>(new Set(["plans"]))

  useEffect(() => {
    if (!playing) return
    const timer = setInterval(
      () =>
        setExpanded((keys) => new Set([keys.has("plans") ? "seats" : "plans"])),
      REPLAY_MS,
    )
    return () => {
      clearInterval(timer)
      setExpanded(new Set(["plans"]))
    }
  }, [playing])

  return (
    <BoardSection
      member="accordion"
      title="Accordion"
      axes={["accordionContainer", "accordionMarker", "accordionMotion"]}
    >
      <Accordion
        expandedKeys={expanded}
        onExpandedChange={setExpanded}
        className="max-w-xl"
      >
        {QUESTIONS.map((item) => (
          <AccordionItem key={item.id} id={item.id}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionPanel>{item.answer}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </BoardSection>
  )
}

const PEOPLE = [
  { name: "Mehdi Ben Hadj Ali", initials: "MB", src: "mehdibha" },
  { name: "Tanner Linsley", initials: "TL", src: "tannerlinsley" },
  { name: "Devon Govett", initials: "DG", src: "devongovett" },
] as const

const SIZES = ["sm", "md", "lg"] as const

function Specimen({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-10 items-center gap-3">{children}</div>
      <span className={CAPTION}>{label}</span>
    </div>
  )
}

function AvatarSection() {
  return (
    <BoardSection
      member="avatar"
      title="Avatar"
      axes={["avatarShape", "avatarFallback"]}
      className="gap-x-14 gap-y-8"
    >
      <Specimen label="Image">
        {SIZES.map((size) => (
          <Avatar key={size} size={size}>
            <AvatarImage
              src={`https://github.com/${PEOPLE[0].src}.png`}
              alt={PEOPLE[0].name}
            />
            <AvatarFallback>{PEOPLE[0].initials}</AvatarFallback>
          </Avatar>
        ))}
      </Specimen>
      <Specimen label="Fallback">
        {SIZES.map((size) => (
          <Avatar key={size} size={size}>
            <AvatarFallback>JL</AvatarFallback>
          </Avatar>
        ))}
      </Specimen>
      <Specimen label="Group">
        <AvatarGroup>
          {PEOPLE.map((person) => (
            <Avatar key={person.src}>
              <AvatarImage
                src={`https://github.com/${person.src}.png`}
                alt={person.name}
              />
              <AvatarFallback>{person.initials}</AvatarFallback>
            </Avatar>
          ))}
          <Avatar>
            <AvatarFallback>JL</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+4</AvatarGroupCount>
        </AvatarGroup>
      </Specimen>
    </BoardSection>
  )
}

const SHORTCUTS = [
  { label: "Command menu", keys: ["⌘", "K"] },
  { label: "New issue", keys: ["C"] },
  { label: "Toggle sidebar", keys: ["⌘", "/"] },
  { label: "Copy link", keys: ["⌘", "⇧", "C"] },
]

function KbdSection() {
  return (
    <BoardSection
      member="kbd"
      title="Kbd"
      axes={["kbdTreatment"]}
      className="gap-x-14 gap-y-8"
    >
      <TextField aria-label="Search" className="w-full max-w-64">
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <Input placeholder="Search…" />
          <InputGroupAddon>
            <Kbd>⌘K</Kbd>
          </InputGroupAddon>
        </InputGroup>
      </TextField>
      <ul className="flex w-full max-w-64 flex-col gap-3 text-sm">
        {SHORTCUTS.map((shortcut) => (
          <li
            key={shortcut.label}
            className="flex items-center justify-between gap-4"
          >
            {shortcut.label}
            <KbdGroup>
              {shortcut.keys.map((key) => (
                <Kbd key={key}>{key}</Kbd>
              ))}
            </KbdGroup>
          </li>
        ))}
      </ul>
    </BoardSection>
  )
}

function CardSection() {
  return (
    <BoardSection
      member="card"
      title="Card"
      axes={["cardHeader", "cardFooter", "surfaceLayers"]}
      className={STACK}
    >
      <div className="grid gap-6 @xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Team members</CardTitle>
            <CardDescription>3 of 5 seats used</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-3">
            {PEOPLE.map((person, i) => (
              <div key={person.src} className="flex items-center gap-3">
                <Avatar size="sm">
                  <AvatarImage
                    src={`https://github.com/${person.src}.png`}
                    alt={person.name}
                  />
                  <AvatarFallback>{person.initials}</AvatarFallback>
                </Avatar>
                <span className="min-w-0 flex-1 truncate">{person.name}</span>
                <span className="text-fg-muted">
                  {i === 0 ? "Owner" : "Member"}
                </span>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="secondary" className="ms-auto">
              Invite
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pro plan</CardTitle>
            <CardDescription>Renews on November 1</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-3">
              <dt className="text-fg-muted">Requests</dt>
              <dd className="text-right tabular-nums">1.2M of 2M</dd>
              <dt className="text-fg-muted">Bandwidth</dt>
              <dd className="text-right tabular-nums">48 GB of 100 GB</dd>
              <dt className="text-fg-muted">Next invoice</dt>
              <dd className="text-right tabular-nums">$60.00</dd>
            </dl>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button size="sm" variant="quiet">
              Invoices
            </Button>
            <Button size="sm" variant="primary">
              Upgrade
            </Button>
          </CardFooter>
        </Card>
      </div>
    </BoardSection>
  )
}

export default function DisplayBoard() {
  return (
    <Board id="display">
      <TableSection />
      <AccordionSection />
      <AvatarSection />
      <KbdSection />
      <CardSection />
    </Board>
  )
}
