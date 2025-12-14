import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
} from "@dotui/registry/ui/combobox";
import { Label } from "@dotui/registry/ui/field";

export default function Demo() {
  return (
    <Combobox>
      <Label>Country</Label>
      <ComboboxInput />
      <ComboboxContent>
        <ComboboxItem>Canada</ComboboxItem>
        <ComboboxItem>France</ComboboxItem>
        <ComboboxItem>Germany</ComboboxItem>
        <ComboboxItem>Spain</ComboboxItem>
        <ComboboxItem>Tunisia</ComboboxItem>
        <ComboboxItem>United states</ComboboxItem>
        <ComboboxItem>United Kingdom</ComboboxItem>
      </ComboboxContent>
    </Combobox>
  );
}
