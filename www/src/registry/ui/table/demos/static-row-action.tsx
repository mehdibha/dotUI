"use client"

import React from "react"

import {
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"

export default function Demo() {
  const [opened, setOpened] = React.useState<string | null>(null)
  return (
    <div className="flex flex-col gap-2">
      <TableContainer>
        <Table aria-label="Files">
          <TableHeader>
            <TableColumn isRowHeader>Name</TableColumn>
            <TableColumn>Type</TableColumn>
            <TableColumn>Date Modified</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow onAction={() => setOpened("Games")}>
              <TableCell>Games</TableCell>
              <TableCell>File folder</TableCell>
              <TableCell>6/7/2020</TableCell>
            </TableRow>
            <TableRow onAction={() => setOpened("Program Files")}>
              <TableCell>Program Files</TableCell>
              <TableCell>File folder</TableCell>
              <TableCell>4/7/2021</TableCell>
            </TableRow>
            <TableRow onAction={() => setOpened("bootmgr")}>
              <TableCell>bootmgr</TableCell>
              <TableCell>System file</TableCell>
              <TableCell>11/20/2010</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {opened && <p className="text-sm text-fg-muted">Opening {opened}</p>}
    </div>
  )
}
