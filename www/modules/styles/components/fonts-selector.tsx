"use client";

import React from "react";
import { ChevronDownIcon } from "lucide-react";
import { useInView } from "motion/react";
import { ListLayout, useFilter, Virtualizer } from "react-aria-components";

import {
  displayFonts,
  handwritingFonts,
  monoFonts,
  sansSerifFonts,
  serifFonts,
} from "@dotui/style-engine/constants";
import { FontLoader } from "@dotui/ui";
import { Button } from "@dotui/ui/components/button";
import { CommandRoot } from "@dotui/ui/components/command";
import { Dialog, DialogRoot } from "@dotui/ui/components/dialog";
import { Label } from "@dotui/ui/components/field";
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
} from "@dotui/ui/components/list-box";
import { SearchField } from "@dotui/ui/components/search-field";
import { Select, SelectItem } from "@dotui/ui/components/select";
import { cn } from "@dotui/ui/lib/utils";

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
          className="space-y-2 p-0!"
        >
          {({ close }) => (
            <>
              <div className="p-2 pb-0">
                <Select selectedKey="featured">
                  <SelectItem id="featured">Featured fonts</SelectItem>
                  <SelectItem id="all">All google fonts</SelectItem>
                </Select>
              </div>
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
                    className="h-full w-full border-0 p-0!"
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
                            id={font.trim().toLowerCase()}
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
            </>
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
