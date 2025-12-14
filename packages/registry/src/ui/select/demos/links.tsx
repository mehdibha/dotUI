import { Label } from "@dotui/registry/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry/ui/select";

export default function Demo() {
  return (
    <Select>
      <Label>Project</Label>
      <SelectTrigger />
      <SelectContent>
        <SelectItem href="#">create new registry...</SelectItem>
        <SelectItem href="https://dotui.org">dotUI</SelectItem>
        <SelectItem href="https://palettify.com">shadcn/ui</SelectItem>
        <SelectItem href="https://coss.com/ui">coss/ui</SelectItem>
      </SelectContent>
    </Select>
  );
}
