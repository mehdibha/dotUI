"use client";

import React from "react";
import Link from "next/link";
import { ListFilterIcon } from "lucide-react";
import { useFilter } from "react-aria-components";
import { useMounted } from "@/hooks/use-mounted";
import { Button } from "@/components/core/button";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogRoot,
} from "@/components/core/dialog";
import { Menu, MenuItem, MenuRoot } from "@/components/core/menu";
import { RadioGroup, Radio } from "@/components/core/radio-group";
import { SearchField } from "@/components/core/search-field";
import { TextField } from "@/components/core/text-field";
import { Skeleton } from "@/registry/core/skeleton_basic";
import { themes } from "@/registry/registry-themes";
import { ThemeProvider } from "@/modules/themes/components/theme-provider";

type Filter = "light" | "dark" | "light-dark" | "all";

export function ThemesExplorer() {
  const isMounted = useMounted();

  const [searchInput, setSearchInput] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("all");
  const { contains } = useFilter({ sensitivity: "base" });

  const filteredThemes = themes
    .filter((theme) => contains(theme.name, searchInput))
    .filter((theme) => {
      if (filter === "light-dark") {
        return theme.foundations.dark && theme.foundations.light;
      }
      if (filter === "light") {
        return theme.foundations.light && !theme.foundations.dark;
      }
      if (filter === "dark") {
        return theme.foundations.dark && !theme.foundations.light;
      }
      return true;
    });

  return (
    <div>
      <div className="mt-6 flex items-center gap-2">
        <SearchField
          placeholder="Search themes..."
          className="flex-1"
          value={searchInput}
          onChange={setSearchInput}
        />
        <MenuRoot>
          <Button prefix={<ListFilterIcon />}>Filter</Button>
          <Menu
            selectionMode="single"
            selectedKeys={new Set([filter])}
            onSelectionChange={(keys) => {
              setFilter([...keys][0] as Filter);
            }}
          >
            <MenuItem id="all">All</MenuItem>
            <MenuItem id="light-dark">Light and dark</MenuItem>
            <MenuItem id="light">Light only</MenuItem>
            <MenuItem id="dark">Dark only</MenuItem>
          </Menu>
        </MenuRoot>
        <DialogRoot>
          <Button variant="primary" className="">
            Create theme
          </Button>
          <Dialog
            title="Create theme"
            description="Create a new theme to get started."
          >
            <DialogBody className="space-y-4">
              <TextField label="Name" className="w-full" />
              <RadioGroup
                label="Mode"
                orientation="horizontal"
                className="w-full"
              >
                <Radio value="light-dark">Light and dark</Radio>
                <Radio value="light">Light</Radio>
                <Radio value="dark">Dark</Radio>
              </RadioGroup>
            </DialogBody>
            <DialogFooter>
              <Button slot="close">Cancel</Button>
              <Button variant="primary" type="submit">
                Create theme
              </Button>
            </DialogFooter>
          </Dialog>
        </DialogRoot>
      </div>
      <h3 className="mt-6 text-lg font-semibold">Your themes</h3>
      <p className="text-fg-muted mt-1">No themes created yet!</p>
      <h3 className="mt-6 text-lg font-semibold">Featured themes</h3>
      <div className="group mt-4 grid grid-cols-2 gap-x-2 gap-y-4">
        {filteredThemes.map((theme) => (
          <div
            key={theme.name}
            className="group/theme-card flex flex-col gap-1 transition-opacity hover:!opacity-100 group-hover:opacity-80"
          >
            <Skeleton show={!isMounted}>
              <ThemeProvider
                key={theme.name}
                theme={theme}
                unstyled
                className="text-fg"
              >
                <Link
                  href={`/themes/${theme.name}`}
                  className="bg-bg flex flex-col items-start justify-start gap-0 overflow-hidden rounded-md border p-0"
                >
                  <div className="flex w-full items-start justify-between p-2">
                    <div>
                      <span className="block text-lg font-semibold">
                        {theme.label}
                      </span>
                      <span className="text-fg-muted block text-sm">
                        {theme.foundations.dark && theme.foundations.light ? (
                          <span>Light and dark mode.</span>
                        ) : (
                          <span>
                            {theme.foundations.dark ? "Dark" : "Light"} mode
                            only.
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="grid w-full grid-cols-10">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          backgroundColor: `var(--neutral-${(i + 1) * 100})`,
                        }}
                        className="h-4"
                      ></div>
                    ))}
                  </div>
                  <div className="grid w-full grid-cols-10">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          backgroundColor: `var(--accent-${(i + 1) * 100})`,
                        }}
                        className="h-4"
                      ></div>
                    ))}
                  </div>
                </Link>
              </ThemeProvider>
            </Skeleton>
          </div>
        ))}
      </div>
    </div>
  );
}
