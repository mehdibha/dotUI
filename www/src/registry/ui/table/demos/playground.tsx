"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
  type TableContainerProps,
  type TableProps,
} from "@/registry/ui/table"

export default function Demo({
  selectionMode = "none",
  striped = false,
  resizable = false,
}: TableProps & Pick<TableContainerProps, "resizable"> = {}) {
  return (
    <TableContainer resizable={resizable}>
      <Table
        aria-label="Files"
        data-control-target
        selectionMode={selectionMode}
        striped={striped}
      >
        <TableHeader>
          <TableColumn id="name" isRowHeader allowsResizing>
            Name
          </TableColumn>
          <TableColumn id="type" allowsResizing>
            Type
          </TableColumn>
          <TableColumn id="date">Date Modified</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Games</TableCell>
            <TableCell>File folder</TableCell>
            <TableCell>6/7/2020</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Program Files</TableCell>
            <TableCell>File folder</TableCell>
            <TableCell>4/7/2021</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>bootmgr</TableCell>
            <TableCell>System file</TableCell>
            <TableCell>11/20/2010</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>log.txt</TableCell>
            <TableCell>Text Document</TableCell>
            <TableCell>1/18/2016</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
