"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  SearchField as _SearchField,
  SearchFieldRoot as _SearchFieldRoot,
} from "../registry/components/search-field/basic";
import type {
  SearchFieldProps,
  SearchFieldRootProps,
} from "../registry/components/search-field/basic";

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
