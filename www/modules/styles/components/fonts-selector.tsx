"use client";

import React from "react";
import { ChevronDownIcon } from "lucide-react";
import { useInView } from "motion/react";
import { ListLayout, useFilter, Virtualizer } from "react-aria-components";

import { FontLoader } from "@dotui/registry";
import {
  displayFonts,
  handwritingFonts,
  monoFonts,
  sansSerifFonts,
  serifFonts,
} from "@dotui/registry/fonts/registry";
import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import { CommandRoot } from "@dotui/registry/ui/command";
import { Dialog, DialogRoot } from "@dotui/registry/ui/dialog";
import { Label } from "@dotui/registry/ui/field";
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
} from "@dotui/registry/ui/list-box";
import { SearchField } from "@dotui/registry/ui/search-field";
import { Select, SelectItem } from "@dotui/registry/ui/select";

export const FontSelector = ({
  label,
  font,
  onFontChange,
  className,
}: {
  label: string;
  font: string;
  onFontChange: (font: string) => void;
  className?: string;
}) => {
  const { contains } = useFilter({ sensitivity: "base" });

  const layout = React.useMemo(() => {
    return new ListLayout({ rowHeight: 32, headingHeight: 20 });
  }, []);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label>{label}</Label>
      <DialogRoot>
        <Button>
          <span className={cn("flex-1 text-left", !font && "text-fg-muted")}>
            {font ?? "Select a font"}
          </span>
          <ChevronDownIcon />
        </Button>
        <Dialog
          type="popover"
          popoverProps={{ placement: "bottom" }}
          className="p-0! space-y-2"
        >
          {({ close }) => (
            <CommandRoot filter={contains} className="h-72">
              <div className="p-2">
                <SearchField
                  placeholder="Search"
                  autoFocus
                  className="w-full"
                />
              </div>
              <Virtualizer layout={layout}>
                <ListBox
                  selectionMode="single"
                  selectedKeys={font ? [font] : []}
                  onSelectionChange={(keys) => {
                    onFontChange(([...keys][0] as string) ?? "");
                    close();
                  }}
                  className="p-0! h-full w-full border-0"
                >
                  {[
                    { title: "Sans serif", items: sansSerifFonts },
                    { title: "Serif", items: serifFonts },
                    { title: "Mono", items: monoFonts },
                    { title: "Display", items: displayFonts },
                    { title: "Handwriting", items: handwritingFonts },
                  ].map(({ title, items }) => (
                    <ListBoxSection key={title} title={title}>
                      {items.map((font) => (
                        <ListBoxItem
                          key={font}
                          id={font}
                          textValue={font}
                          className="font-body"
                          style={
                            {
                              "--font-body": font,
                            } as React.CSSProperties
                          }
                        >
                          {font}
                          <FontLoaderInView font={font} />
                        </ListBoxItem>
                      ))}
                    </ListBoxSection>
                  ))}
                </ListBox>
              </Virtualizer>
            </CommandRoot>
          )}
        </Dialog>
      </DialogRoot>
    </div>
  );
};

const FontLoaderInView = ({ font }: { font: string }) => {
  const ref = React.useRef(null);
  const inView = useInView(ref);

  return (
    <>
      <span ref={ref} />
      {inView && <FontLoader font={font} />}
    </>
  );
};
