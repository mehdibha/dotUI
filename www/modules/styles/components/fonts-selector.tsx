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

import { FontLoader } from "@dotui/registry";
import {
  displayFonts,
  handwritingFonts,
  monoFonts,
  sansSerifFonts,
  serifFonts,
} from "@dotui/registry/fonts/registry";
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
import { Select, SelectTrigger, SelectValue } from "@dotui/registry/ui/select";
import type { SelectProps } from "@dotui/registry/ui/select";

export const FontSelector = <T extends object>({
  label,
  ...props
}: SelectProps<T> & { label?: string }) => {
  const { contains } = useFilter({ sensitivity: "base" });

  return (
    <Select {...props}>
      {label && <Label>{label}</Label>}
      <SelectTrigger asChild>
        <Button className="w-full">
          <SelectValue />
          <ChevronDownIcon />
        </Button>
      </SelectTrigger>
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
                <ListBoxSection
                  id={section.title}
                >
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

  // return (
  //   <div className={cn("flex flex-col gap-2", className)}>
  //     <Label>{label}</Label>
  //     <DialogRoot>
  //       <Button>
  //         <span className={cn("flex-1 text-left", !font && "text-fg-muted")}>
  //           {font ?? "Select a font"}
  //         </span>
  //         <ChevronDownIcon />
  //       </Button>
  //       <Dialog
  //         type="popover"
  //         popoverProps={{ placement: "bottom" }}
  //         className="p-0! space-y-2"
  //       >
  //         {({ close }) => (
  //           <CommandRoot filter={contains} className="h-72">
  //             <div className="p-2">
  //               <SearchField
  //                 placeholder="Search"
  //                 autoFocus
  //                 className="w-full"
  //               />
  //             </div>
  //             <Virtualizer layout={layout}>
  //               <ListBox
  //                 selectionMode="single"
  //                 selectedKeys={font ? [font] : []}
  //                 onSelectionChange={(keys) => {
  //                   onFontChange(([...keys][0] as string) ?? "");
  //                   close();
  //                 }}
  //                 className="p-0! h-full w-full border-0"
  //               >
  //                 {[
  //                   { title: "Sans serif", items: sansSerifFonts },
  //                   { title: "Serif", items: serifFonts },
  //                   { title: "Mono", items: monoFonts },
  //                   { title: "Display", items: displayFonts },
  //                   { title: "Handwriting", items: handwritingFonts },
  //                 ].map(({ title, items }) => (
  //                   <ListBoxSection key={title} title={title}>
  //                     {items.map((font) => (
  //                       <ListBoxItem
  //                         key={font}
  //                         id={font}
  //                         textValue={font}
  //                         className="font-body"
  //                         style={
  //                           {
  //                             "--font-body": font,
  //                           } as React.CSSProperties
  //                         }
  //                       >
  //                         {font}
  //                         <FontLoaderInView font={font} />
  //                       </ListBoxItem>
  //                     ))}
  //                   </ListBoxSection>
  //                 ))}
  //               </ListBox>
  //             </Virtualizer>
  //           </CommandRoot>
  //         )}
  //       </Dialog>
  //     </DialogRoot>
  //   </div>
  // );
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
