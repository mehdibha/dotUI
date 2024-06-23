"use client";

import { useAsyncList } from "react-stately";
import { ListBox, ListBoxItem } from "@/lib/components/core/default/list-box";

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
    <ListBox aria-label="Pick a Pokemon" items={list.items} isLoading selectionMode="single">
      {(item) => <ListBoxItem id={item.name}>{item.name}</ListBoxItem>}
    </ListBox>
  );
}
