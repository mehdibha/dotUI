"use client";

import type { Control } from "@dotui/registry/playground";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "../index";

interface TablePlaygroundProps {
  selectionMode?: "none" | "single" | "multiple";
}

export function TablePlayground({
  selectionMode = "none",
}: TablePlaygroundProps) {
  return (
    <Table aria-label="Files" selectionMode={selectionMode}>
      <TableHeader>
        <TableColumn isRowHeader>Name</TableColumn>
        <TableColumn>Type</TableColumn>
        <TableColumn>Date Modified</TableColumn>
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
      </TableBody>
    </Table>
  );
}

export const tableControls: Control[] = [
  {
    type: "enum",
    name: "selectionMode",
    options: ["none", "single", "multiple"],
    defaultValue: "none",
  },
];
