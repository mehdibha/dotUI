"use client";

import {
  TableRoot,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
  TableCell,
} from "@/registry/core/table";

export default function Demo() {
  return (
    <TableRoot aria-label="Files">
      <TableHeader>
        <TableColumn isRowHeader>Name</TableColumn>
        <TableColumn>Type</TableColumn>
        <TableColumn>Date Modified</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow onAction={() => alert("Opening games")}>
          <TableCell>Games</TableCell>
          <TableCell>File folder</TableCell>
          <TableCell>6/7/2020</TableCell>
        </TableRow>
        <TableRow onAction={() => alert("Opening program files")}>
          <TableCell>Program Files</TableCell>
          <TableCell>File folder</TableCell>
          <TableCell>4/7/2021</TableCell>
        </TableRow>
        <TableRow onAction={() => alert("Opening bootmgr")}>
          <TableCell>bootmgr</TableCell>
          <TableCell>System file</TableCell>
          <TableCell>11/20/2010</TableCell>
        </TableRow>
      </TableBody>
    </TableRoot>
  );
}
