"use client";

import {
  TableRoot,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
  TableCell,
} from "@/registry/core/table_basic";

const columns: Column[] = [
  { name: "Name", id: "name", isRowHeader: true },
  { name: "Type", id: "type" },
  { name: "Date Modified", id: "date" },
];

const data: Item[] = [
  { id: 1, name: "Games", date: "6/7/2020", type: "File folder" },
  { id: 2, name: "Program Files", date: "4/7/2021", type: "File folder" },
  { id: 3, name: "bootmgr", date: "11/20/2010", type: "System file" },
  { id: 4, name: "log.txt", date: "1/18/2016", type: "Text Document" },
];

export default function Demo() {
  return (
    <TableRoot aria-label="Files">
      <TableHeader columns={columns}>
        <TableColumn isRowHeader>Name</TableColumn>
        <TableColumn>URL</TableColumn>
        <TableColumn>Date added</TableColumn>
      </TableHeader>
      <TableBody items={data}>
        <TableRow href="https://adobe.com/" target="_blank">
          <TableCell>Adobe</TableCell>
          <TableCell>https://adobe.com/</TableCell>
          <TableCell>January 28, 2023</TableCell>
        </TableRow>
        <TableRow href="https://google.com/" target="_blank">
          <TableCell>Google</TableCell>
          <TableCell>https://google.com/</TableCell>
          <TableCell>April 5, 2023</TableCell>
        </TableRow>
        <TableRow href="https://nytimes.com/" target="_blank">
          <TableCell>New York Times</TableCell>
          <TableCell>https://nytimes.com/</TableCell>
          <TableCell>July 12, 2023</TableCell>
        </TableRow>
      </TableBody>
    </TableRoot>
  );
}

type Item = {
  id: number;
  name: string;
  date: string;
  type: string;
};

interface Column {
  id: keyof Omit<Item, "id">;
  name: string;
  isRowHeader?: boolean;
}
