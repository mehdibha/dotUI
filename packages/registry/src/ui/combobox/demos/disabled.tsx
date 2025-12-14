import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
} from "@dotui/registry/ui/combobox";

export default function Demo() {
  return (
    <Combobox isDisabled>
      <ComboboxInput />
      <ComboboxContent>
        <ComboboxItem id="red panda">Red Panda</ComboboxItem>
        <ComboboxItem id="cat">Cat</ComboboxItem>
        <ComboboxItem id="dog">Dog</ComboboxItem>
        <ComboboxItem id="aardvark">Aardvark</ComboboxItem>
        <ComboboxItem id="kangaroo">Kangaroo</ComboboxItem>
        <ComboboxItem id="snake">Snake</ComboboxItem>
      </ComboboxContent>
    </Combobox>
  );
}
