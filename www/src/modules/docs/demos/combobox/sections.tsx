import React from "react";
import { Combobox, ComboboxItem } from "@/components/dynamic-ui/combobox";
import { ListBoxSection } from "@/components/dynamic-ui/list-box";

export default function Demo() {
  return (
    <Combobox aria-label="Country">
      <ListBoxSection title="Africa">
        <ComboboxItem>Tunisia</ComboboxItem>
        <ComboboxItem>Algeria</ComboboxItem>
        <ComboboxItem>Morocco</ComboboxItem>
      </ListBoxSection>
      <ListBoxSection title="America">
        <ComboboxItem>Canada</ComboboxItem>
        <ComboboxItem>United states</ComboboxItem>
      </ListBoxSection>
      <ListBoxSection title="Asia">
        <ComboboxItem>India</ComboboxItem>
        <ComboboxItem>Japan</ComboboxItem>
        <ComboboxItem>Korea</ComboboxItem>
      </ListBoxSection>
      <ListBoxSection title="Europe">
        <ComboboxItem>France</ComboboxItem>
        <ComboboxItem>Germany</ComboboxItem>
        <ComboboxItem>Spain</ComboboxItem>
        <ComboboxItem>United Kingdom</ComboboxItem>
      </ListBoxSection>
    </Combobox>
  );
}
