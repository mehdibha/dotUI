import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
} from "@dotui/registry/ui/combobox";

export default function Demo() {
  return (
    <Combobox aria-label="country">
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
