import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
} from "@dotui/registry/ui/combobox";

export default function Demo() {
  return (
    <Combobox>
      <ComboboxInput />
      <ComboboxContent isLoading>
        <ComboboxItem>Red Panda</ComboboxItem>
        <ComboboxItem>Cat</ComboboxItem>
        <ComboboxItem>Dog</ComboboxItem>
        <ComboboxItem>Aardvark</ComboboxItem>
        <ComboboxItem>Kangaroo</ComboboxItem>
        <ComboboxItem>Snake</ComboboxItem>
      </ComboboxContent>
    </Combobox>
  );
}
