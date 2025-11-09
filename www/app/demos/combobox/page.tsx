import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
} from "@dotui/registry/ui/combobox";

export default function Page() {
  return (
    <Combobox aria-label="Country">
      <ComboboxInput placeholder="Select country..." />
      <ComboboxContent>
        <ComboboxItem>Canada</ComboboxItem>
        <ComboboxItem>France</ComboboxItem>
        <ComboboxItem>Germany</ComboboxItem>
        <ComboboxItem>Japan</ComboboxItem>
        <ComboboxItem>United Kingdom</ComboboxItem>
        <ComboboxItem>United States</ComboboxItem>
      </ComboboxContent>
    </Combobox>
  );
}

