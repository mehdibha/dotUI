"use client";

import { useDragAndDrop } from "react-aria-components";
import { useListData } from "react-stately";
import {
  TableRoot,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
  TableCell,
} from "@/modules/registry/ui/table.basic";

const columns: Column[] = [
  { name: "Name", id: "name", isRowHeader: true },
  { name: "Type", id: "type" },
  { name: "Date Modified", id: "date" },
];

export default function Demo() {
  const list = useListData<Item>({
    initialItems: [
      { id: 1, name: "Games", date: "6/7/2020", type: "File folder" },
      { id: 2, name: "Program Files", date: "4/7/2021", type: "File folder" },
      { id: 3, name: "bootmgr", date: "11/20/2010", type: "System file" },
      { id: 4, name: "log.txt", date: "1/18/2016", type: "Text Document" },
    ],
  });

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => {
        const item = list.getItem(key);
        return {
          "text/plain": item?.name ?? "",
        };
      }),
    onReorder(e) {
      if (e.target.dropPosition === "before") {
        list.moveBefore(e.target.key, e.keys);
      } else if (e.target.dropPosition === "after") {
        list.moveAfter(e.target.key, e.keys);
      }
    },
  });

  return (
    <TableRoot aria-label="Files" dragAndDropHooks={dragAndDropHooks}>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn isRowHeader={column.isRowHeader}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={list.items}>
        {(item) => (
          <TableRow columns={columns}>
            {(column) => <TableCell>{item[column.id]}</TableCell>}
          </TableRow>
        )}
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
