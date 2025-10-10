"use client";

import { ThemeModeSwitch } from "@/components/ui/theme-mode-switch";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";

export const ThemeSwitcher = () => {
  const { activeMode, setActiveMode } = usePreferences();

  return (
    <ThemeModeSwitch
      size="sm"
      shape="square"
      isSelected={activeMode === "dark"}
      onChange={(isSelected) => setActiveMode(isSelected ? "dark" : "light")}
    />
  );
};
