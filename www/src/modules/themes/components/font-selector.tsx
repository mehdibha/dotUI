"use client";

import React from "react";
import { ChevronDownIcon } from "lucide-react";
import { useInView } from "motion/react";
import { Virtualizer, ListLayout, useFilter } from "react-aria-components";
import { cn } from "@/lib/utils";
import { Button } from "@/components/core/button";
import { CommandRoot } from "@/components/core/command";
import { DialogRoot, Dialog } from "@/components/core/dialog";
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
} from "@/components/core/list-box";
import { SearchField } from "@/components/core/search-field";
import { Select, SelectItem } from "@/components/core/select";
import { FontLoader } from "@/modules/themes/components/font-loader";
import {
  sansSerifFonts,
  monoFonts,
  serifFonts,
  displayFonts,
  handwritingFonts,
} from "@/modules/themes/lib/google-fonts";

export const FontSelector = ({
  label,
  font,
  onFontChange,
}: {
  label: string;
  font: string | null;
  onFontChange: (font: string | null) => void;
}) => {
  const { contains } = useFilter({ sensitivity: "base" });

  const layout = React.useMemo(() => {
    return new ListLayout({ rowHeight: 32, headingHeight: 20 });
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <p className="text-fg-muted text-sm">{label}</p>
      <DialogRoot>
        <Button variant="outline">
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
                      onFontChange(([...keys][0] as string | null) ?? null);
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
