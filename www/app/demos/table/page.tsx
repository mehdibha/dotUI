import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@dotui/registry/ui/table";

export default function Page() {
  return (
    <Table aria-label="Files">
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
          <TableCell>Documents</TableCell>
          <TableCell>File folder</TableCell>
          <TableCell>4/7/2021</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

