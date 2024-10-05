import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultTheme } from "@/lib/theme";
import type { IconLibrary } from "@/registry/icons";
import type { Theme } from "@/types/theme";
import type { Style } from "@/registry/styles";

type Config = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  style: Style["name"];
  setStyle: (style: Style["name"]) => void;
  mode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void;
  iconLibrary: IconLibrary;
  setIconLibrary: (iconLibrary: IconLibrary) => void;
};

export const useConfig = create<Config>()(
  persist(
    (set) => ({
      style: "default",
      mode: "dark",
      iconLibrary: "lucide",
      theme: defaultTheme,
      setStyle: (style: Style["name"]) => set((state) => ({ ...state, style })),
      setTheme: (theme: Theme) => set((state) => ({ ...state, theme })),
      setMode: (mode: "light" | "dark") => set((state) => ({ ...state, mode })),
      setIconLibrary: (iconLibrary: IconLibrary) =>
        set((state) => ({ ...state, iconLibrary })),
    }),
    {
      name: "preview-theme",
    }
  )
);
