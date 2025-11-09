import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
} from "@dotui/registry/ui/combobox";

export default function Page() {
  return (
    <Combobox aria-label="Framework">
      <ComboboxInput placeholder="Search framework..." />
      <ComboboxContent>
        <ComboboxItem>Next.js</ComboboxItem>
        <ComboboxItem>Remix</ComboboxItem>
        <ComboboxItem>Astro</ComboboxItem>
        <ComboboxItem>Gatsby</ComboboxItem>
      </ComboboxContent>
    </Combobox>
  );
}

