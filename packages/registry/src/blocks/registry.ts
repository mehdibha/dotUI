import type { Registry } from "@dotui/registry/types";

import loginMeta from "./auth/login/meta";
import cardsMeta from "./showcase/cards/meta";

export const blocksCategories: { name: string; slug: string; path: string | undefined }[] = [
	{ name: "Featured", slug: "featured", path: undefined },
];

export const registryBlocks: Registry["items"] = [loginMeta, cardsMeta];
