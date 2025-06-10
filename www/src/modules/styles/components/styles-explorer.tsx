"use client";

import React from "react";
// import { useMounted } from "@/hooks/use-mounted";
// import { Button } from "@/components/ui/button";
// import { Menu, MenuItem, MenuRoot } from "@/components/ui/menu";
import { SearchField } from "@/components/ui/search-field";
import { cn } from "@/lib/utils";
import { useStyles } from "@/modules/styles/atoms/styles-atom";
import type { Style } from "@/modules/styles/types";
import { styles } from "@/registry/registry-styles";
// import { ListFilterIcon } from "lucide-react";
import { useFilter } from "react-aria-components";

import { StyleCard } from "./style-card";

// type Filter = "light" | "dark" | "light-dark" | "all";

// const FILTER_OPTIONS: Array<{ id: Filter; label: string }> = [
//   { id: "all", label: "All" },
//   { id: "light-dark", label: "Light and dark" },
//   { id: "light", label: "Light only" },
//   { id: "dark", label: "Dark only" },
// ];

const StylesGrid: React.FC<{
  styles: Style[];
  currentStyleName: string;
  onDelete?: (name: string) => void;
  onSetCurrent?: (name: string) => void;
  className?: string;
}> = ({ styles, currentStyleName, onDelete, onSetCurrent, className }) => (
  <div className={cn("group grid grid-cols-3 gap-x-2 gap-y-4", className)}>
    {styles.length > 0 ? (
      styles.map((style) => (
        <StyleCard
          key={style.name}
          style={style}
          onDelete={onDelete ? () => onDelete(style.name) : undefined}
          isCurrent={style.name === currentStyleName}
          onSetCurrent={() => onSetCurrent?.(style.name)}
        />
      ))
    ) : (
      <p className="text-fg-muted">No styles created yet.</p>
    )}
  </div>
);

export function StylesExplorer({ className }: { className?: string }) {
  // const isMounted = useMounted();
  const { currentStyle, setCurrentStyle } = useStyles();
  const [searchInput, setSearchInput] = React.useState("");
  const { contains } = useFilter({ sensitivity: "base" });

  const filteredStyles = React.useMemo(() => {
    return styles.filter((style) => contains(style.name, searchInput));
  }, [searchInput, contains]);

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <SearchField
          placeholder="Search styles..."
          className="flex-1"
          value={searchInput}
          onChange={setSearchInput}
        />
      </div>
      <StylesGrid
        styles={filteredStyles}
        currentStyleName={currentStyle.name}
        onSetCurrent={setCurrentStyle}
        className="mt-4"
      />
    </div>
  );
}
