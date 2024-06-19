"use client"

import React from "react";
import { useAsyncList } from "react-stately";
import { Item } from "@/lib/components/core/default/list-box";
import { Select } from "@/lib/components/core/default/select";

interface Character {
  name: string;
}

export default function Demo() {
  const list = useAsyncList<Character>({
    async load({ signal, filterText }) {
      let res = await fetch(`https://pokeapi.co/api/v2/pokemon`, { signal });
      let json = await res.json();

      return {
        items: json.results,
      };
    },
  });
  return (
    <Select items={list.items}>
      {(item) => <Item id={item.name}>{item.name}</Item>}
    </Select>
  );
}
