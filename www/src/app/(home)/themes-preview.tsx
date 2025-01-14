"use client";

import React from "react";
import { dotUIThemes } from "@/lib/themes";
import { useThemes } from "@/hooks/use-themes";
import { ToggleButton } from "@/components/core/toggle-button";
import { ToggleButtonGroup } from "@/components/core/toggle-button-group";
import { ThemeOverride } from "@/components/theme-override";
import { ComponentsOverview } from "./components-overview";

export function ThemesPreview() {
  const { themes, currentThemeId, setCurrentThemeId } = useThemes();

  return (
    <div>
      <ToggleButtonGroup
        className="justify-center"
        defaultSelectedKeys={[currentThemeId]}
        onSelectionChange={(keys) => setCurrentThemeId([...keys][0] as string)}
        disallowEmptySelection
      >
        {[...dotUIThemes, ...themes].map((theme) => (
          <ToggleButton
            key={theme.id}
            id={theme.id}
            shape="rectangle"
            size="sm"
            className="px-4"
          >
            {theme.name}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <ThemeOverride className="mt-6 rounded-xl border shadow-lg">
        <ComponentsOverview />
      </ThemeOverride>
    </div>
  );
}
