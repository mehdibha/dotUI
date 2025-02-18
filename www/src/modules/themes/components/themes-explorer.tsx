"use client";

import React from "react";
import { ListFilterIcon } from "lucide-react";
import { useFilter } from "react-aria-components";
import { Button } from "@/components/core/button";
import { Menu, MenuItem, MenuRoot } from "@/components/core/menu";
import { SearchField } from "@/components/core/search-field";
import { themes } from "@/registry/registry-themes";
import { useUserThemes } from "@/modules/themes/atoms/themes-atom";
import { CreateThemeDialog } from "./create-theme-dialog";
import { ThemeCard } from "./theme-card";

type Filter = "light" | "dark" | "light-dark" | "all";

export function ThemesExplorer() {
  const { currentThemeName, userThemes, deleteTheme } = useUserThemes();
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

  const filteredUserThemes = userThemes
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
        <CreateThemeDialog>
          <Button variant="primary" className="">
            Create theme
          </Button>
        </CreateThemeDialog>
      </div>
      <div className="group mt-4 grid grid-cols-3 gap-x-2 gap-y-4">
        {filteredThemes.map((theme) => (
          <ThemeCard
            key={theme.name}
            theme={theme}
            isCurrent={theme.name === currentThemeName}
          />
        ))}
      </div>
      <h3 className="mt-6 text-lg font-semibold">Your themes</h3>
      <div className="group mt-2 grid grid-cols-3 gap-x-2 gap-y-4">
        {filteredUserThemes.length > 0 ? (
          filteredUserThemes.map((theme) => (
            <ThemeCard
              key={theme.name}
              theme={theme}
              isDeletable
              onDelete={() => deleteTheme(theme.name)}
              isCurrent={theme.name === currentThemeName}
            />
          ))
        ) : (
          <p className="text-fg-muted">No themes created yet.</p>
        )}
      </div>
    </div>
  );
}
