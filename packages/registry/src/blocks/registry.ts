import type { Registry } from "@dotui/registry/types";

import loginMeta from "./auth/login/meta";
import cardsMeta from "./showcase/cards/meta";

export const blocksCategories: { name: string; slug: string }[] = [
  { name: "Featured", slug: "featured" },
];

export const registryBlocks: Registry["items"] = [loginMeta, cardsMeta];
