import React from "react";
import { Combobox } from "@/components/dynamic-core/combobox";
import { Item } from "@/components/dynamic-core/list-box";
import { Section } from "@/components/dynamic-core/section";

export default function Demo() {
  return (
    <Combobox aria-label="Country">
      <Section title="Africa">
        <Item>Tunisia</Item>
        <Item>Algeria</Item>
        <Item>Morocco</Item>
      </Section>
      <Section title="America">
        <Item>Canada</Item>
        <Item>United states</Item>
      </Section>
      <Section title="Asia">
        <Item>India</Item>
        <Item>Japan</Item>
        <Item>Korea</Item>
      </Section>
      <Section title="Europe">
        <Item>France</Item>
        <Item>Germany</Item>
        <Item>Spain</Item>
        <Item>United Kingdom</Item>
      </Section>
    </Combobox>
  );
}
