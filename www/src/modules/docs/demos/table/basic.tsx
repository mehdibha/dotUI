"use client";

import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRoot,
  TableRow,
} from "@/registry/ui/table.basic";

export default function Demo() {
  return (
    <TableRoot aria-label="Files">
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
    </TableRoot>
  );
}
