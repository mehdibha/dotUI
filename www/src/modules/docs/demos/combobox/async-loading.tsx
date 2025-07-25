"use client";

import { Combobox, ComboboxItem } from "@/components/dynamic-ui/combobox";
import { useAsyncList } from "react-stately";

interface Character {
  name: string;
}

export default function Demo() {
  const list = useAsyncList<Character>({
    async load({ signal }) {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon`, { signal });
      const json = (await res.json()) as { results: Character[] };
      return {
        items: json.results,
      };
    },
  });

  return (
    <Combobox label="Pokemon" items={list.items} isLoading={list.isLoading}>
      {(item) => <ComboboxItem id={item.name}>{item.name}</ComboboxItem>}
    </Combobox>
  );
}
