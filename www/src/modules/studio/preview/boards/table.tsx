"use client"

import { useEffect, useState } from "react"
import type { Selection } from "react-aria-components"

import { Badge } from "@/registry/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"

import { Board, BoardSection, useReplay, useSteps } from "./board"

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

const REST = "ENG-398"

export default function TableBoard() {
  const motion = useReplay("tableMotion")
  const replaying = motion.running
  const step = useSteps(motion, 1200)
  const [selected, setSelected] = useState<Selection>(new Set([REST]))

  useEffect(() => {
    const row = replaying ? ISSUES[(step + 1) % ISSUES.length]?.id : REST
    setSelected(new Set([row ?? REST]))
  }, [replaying, step])

  return (
    <Board id="table">
      <BoardSection title="In context" className="block">
        <TableContainer>
          <Table
            aria-label="Issues"
            selectionMode="multiple"
            selectedKeys={selected}
            onSelectionChange={setSelected}
            sortDescriptor={{ column: "updated", direction: "descending" }}
          >
            <TableHeader>
              <TableColumn className={WIDE}>Issue</TableColumn>
              <TableColumn isRowHeader>Title</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn
                id="updated"
                allowsSorting
                className={`text-right ${WIDER}`}
              >
                Updated
              </TableColumn>
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
    </Board>
  )
}
