"use client";

import { use } from "react";
import {
  Autocomplete as AriaAutocomplete,
  DialogContext,
  Provider,
  SearchFieldContext,
  useFilter,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionTitle,
} from "./list-box";
import { SearchField } from "./search-field";

const commandStyles = tv({
  slots: {
    base: [
      "rounded-lg not-in-popover:not-in-modal:not-in-drawer:border not-in-popover:not-in-modal:not-in-drawer:bg-card in-popover:rounded-[inherit] in-modal:rounded-[inherit] in-drawer:rounded-[inherit]",
      "[&_[data-slot=list-box]]:w-full [&_[data-slot=list-box]]:border-0 [&_[data-slot=list-box]]:bg-transparent",
      "[&_[data-slot=search-field]]:w-full [&_[data-slot=search-field]]:outline-none [&_[data-slot=search-field]_[data-slot=input-group]]:rounded-b-none [&_[data-slot=search-field]_[data-slot=input-group]]:border-0 [&_[data-slot=search-field]_[data-slot=input-group]]:border-b [&_[data-slot=search-field]_[data-slot=input-group]]:bg-transparent",
      "in-modal:w-full",
    ],
  },
});

const { base } = commandStyles();

/* -----------------------------------------------------------------------------------------------*/

interface CommandProps extends React.ComponentProps<"div"> {}

function Command({ className, ...props }: CommandProps) {
  const { contains } = useFilter({ sensitivity: "base" });
  const inDialog = !!use(DialogContext);
  const searchFieldContext = use(SearchFieldContext);
  return (
    <AriaAutocomplete filter={contains}>
      <Provider
        values={[
          [SearchFieldContext, { ...searchFieldContext, autoFocus: inDialog }],
        ]}
      >
        <div {...props} className={base({ className })}></div>
      </Provider>
    </AriaAutocomplete>
  );
}

/* -----------------------------------------------------------------------------------------------*/

const CompoundCommand = Object.assign(Command, {
  SearchField,
  List: ListBox,
  Item: ListBoxItem,
  Section: ListBoxSection,
  SectionTitle: ListBoxSectionTitle,
});

export { CompoundCommand as Command };
