import { Select, SelectItem } from "@dotui/registry/ui/select";

export default function Demo() {
  return (
    <Select label="Project">
      <SelectItem href="#">Create new...</SelectItem>
      <SelectItem>DotUI</SelectItem>
      <SelectItem>Palettify</SelectItem>
      <SelectItem>Notionfolio</SelectItem>
    </Select>
  );
}
