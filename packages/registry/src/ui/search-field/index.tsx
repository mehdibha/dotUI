"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import {
  SearchField as _SearchField,
  SearchFieldRoot as _SearchFieldRoot,
} from "./basic";
import type { SearchFieldProps, SearchFieldRootProps } from "./basic";

export const SearchField = createDynamicComponent(
  "search-field",
  "SearchField",
  _SearchField,
  {},
);

export const SearchFieldRoot = createDynamicComponent(
  "search-field",
  "SearchFieldRoot",
  _SearchFieldRoot,
  {},
);

export type { SearchFieldProps, SearchFieldRootProps };
