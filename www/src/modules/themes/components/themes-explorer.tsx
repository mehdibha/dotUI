"use client";

import React from "react";
import { ListFilterIcon } from "lucide-react";
import { useFilter } from "react-aria-components";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { Button } from "@/components/core/button";
import { Menu, MenuItem, MenuRoot } from "@/components/core/menu";
import { SearchField } from "@/components/core/search-field";
import { themes } from "@/registry/registry-themes";
import { useUserThemes } from "@/modules/themes/atoms/themes-atom";
import { CreateThemeDialog } from "./create-theme-dialog";
import { ThemeCard } from "./theme-card";

type Filter = "light" | "dark" | "light-dark" | "all";
type Theme = (typeof themes)[number];

const FILTER_OPTIONS: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "All" },
  { id: "light-dark", label: "Light and dark" },
  { id: "light", label: "Light only" },
  { id: "dark", label: "Dark only" },
];

const filterThemes = (themes: Theme[], filter: Filter) => {
  if (filter === "light-dark") {
    return themes.filter(
      (theme) => theme.foundations.dark && theme.foundations.light
    );
  }
  if (filter === "light") {
    return themes.filter(
      (theme) => theme.foundations.light && !theme.foundations.dark
    );
  }
  if (filter === "dark") {
    return themes.filter(
      (theme) => theme.foundations.dark && !theme.foundations.light
    );
  }
  return themes;
};

const ThemeGrid: React.FC<{
  themes: Theme[];
  currentThemeName: string;
  onDelete?: (name: string) => void;
  onSetCurrent?: (name: string) => void;
  className?: string;
}> = ({ themes, currentThemeName, onDelete, onSetCurrent, className }) => (
  <div className={cn("group grid grid-cols-3 gap-x-2 gap-y-4", className)}>
    {themes.length > 0 ? (
      themes.map((theme) => (
        <ThemeCard
          key={theme.name}
          theme={theme}
          onDelete={onDelete ? () => onDelete(theme.name) : undefined}
          isCurrent={theme.name === currentThemeName}
          onSetCurrent={() => onSetCurrent?.(theme.name)}
        />
      ))
    ) : (
      <p className="text-fg-muted">No themes created yet.</p>
    )}
  </div>
);

export function ThemesExplorer({ className }: { className?: string }) {
  const isMounted = useMounted();
  const { currentThemeName, userThemes, deleteTheme, setCurrentTheme } =
    useUserThemes();
  const [searchInput, setSearchInput] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("all");
  const { contains } = useFilter({ sensitivity: "base" });

  const filteredThemes = React.useMemo(() => {
    const searchFiltered = themes.filter((theme) =>
      contains(theme.name, searchInput)
    );
    return filterThemes(searchFiltered, filter);
  }, [searchInput, filter, contains]);

  const filteredUserThemes = React.useMemo(() => {
    const searchFiltered = userThemes.filter((theme) =>
      contains(theme.name, searchInput)
    );
    return filterThemes(searchFiltered, filter);
  }, [userThemes, searchInput, filter, contains]);

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
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
            onSelectionChange={(keys) => setFilter([...keys][0] as Filter)}
          >
            {FILTER_OPTIONS.map((option) => (
              <MenuItem key={option.id} id={option.id}>
                {option.label}
              </MenuItem>
            ))}
          </Menu>
        </MenuRoot>
        <CreateThemeDialog>
          <Button variant="primary">Create theme</Button>
        </CreateThemeDialog>
      </div>
      <ThemeGrid
        themes={filteredThemes}
        currentThemeName={currentThemeName}
        onSetCurrent={setCurrentTheme}
        className="mt-4"
      />
      <h3 className="mt-4 text-lg font-semibold">Your themes</h3>
      {isMounted ? (
        <ThemeGrid
          themes={filteredUserThemes}
          currentThemeName={currentThemeName}
          onDelete={deleteTheme}
          onSetCurrent={setCurrentTheme}
          className="mt-2"
        />
      ) : (
        <ThemeGrid
          themes={themes.slice(0, 3)}
          currentThemeName={currentThemeName}
          className="mt-2"
        />
      )}
    </div>
  );
}
