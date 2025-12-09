"use client";

import React from "react";
import { ChevronDownIcon } from "lucide-react";
import { useInView } from "motion/react";
import {
  Autocomplete,
  ListLayout,
  useFilter,
  Virtualizer,
} from "react-aria-components";

import {
  displayFonts,
  handwritingFonts,
  monoFonts,
  sansSerifFonts,
  serifFonts,
} from "@dotui/registry/fonts/registry";
import { FontLoader } from "@dotui/registry/providers";
import { Button } from "@dotui/registry/ui/button";
import { Label } from "@dotui/registry/ui/field";
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@dotui/registry/ui/list-box";
import { Popover } from "@dotui/registry/ui/popover";
import { SearchField } from "@dotui/registry/ui/search-field";
import { Select, SelectValue } from "@dotui/registry/ui/select";
import type { SelectProps } from "@dotui/registry/ui/select";

export const FontSelector = <T extends object>({
  label,
  ...props
}: SelectProps<T> & { label?: string }) => {
  const { contains } = useFilter({ sensitivity: "base" });

  return (
    <Select {...props}>
      {label && <Label>{label}</Label>}
      <Button className="w-full">
        <SelectValue />
        <ChevronDownIcon />
      </Button>
      <Popover className="flex h-72 flex-col overflow-hidden">
        <Autocomplete filter={contains}>
          {/* <div></div> */}
          <div className="p-2">
            <SearchField autoFocus className="w-full" />
          </div>
          <Virtualizer
            layout={ListLayout}
            layoutOptions={{
              rowHeight: 32,
              padding: 0,
              gap: 1,
              estimatedHeadingHeight: 20,
            }}
          >
            <ListBox
              items={[
                { title: "Sans serif", items: sansSerifFonts },
                { title: "Serif", items: serifFonts },
                { title: "Mono", items: monoFonts },
                { title: "Display", items: displayFonts },
                { title: "Handwriting", items: handwritingFonts },
              ]}
              className="w-[calc(var(--trigger-width)-2px)] flex-1 p-0"
            >
              {(section) => (
                <ListBoxSection id={section.title}>
                  <ListBoxSectionHeader>{section.title}</ListBoxSectionHeader>
                  {section.items.map((item) => (
                    <ListBoxItem key={item} id={item} className="h-8">
                      {item}
                    </ListBoxItem>
                  ))}
                </ListBoxSection>
              )}
            </ListBox>
          </Virtualizer>
        </Autocomplete>
      </Popover>
    </Select>
  );
};

const _FontLoaderInView = ({ font }: { font: string }) => {
  const ref = React.useRef(null);
  const inView = useInView(ref);

  return (
    <>
      <span ref={ref} />
      {inView && <FontLoader font={font} />}
    </>
  );
};
