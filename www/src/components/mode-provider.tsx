"use client";

import React from "react";
import { useTheme } from "next-themes";
import { useLocalStorage } from "react-use";

const PREVIEW_MODE_STORAGE_NAME: string = "preview-mode";
const PREVIEW_MODE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const ModeProviderContext = React.createContext<{
  mode: "light" | "dark" | null;
  setMode: (mode: "light" | "dark") => void;
}>({
  mode: null,
  setMode: () => {},
});

export function PreviewModeProvider({
  defaultMode,
  children,
}: {
  defaultMode: "light" | "dark" | null;
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const [mode, setMode] = useLocalStorage<"light" | "dark" | null>(
    PREVIEW_MODE_STORAGE_NAME,
    defaultMode,
    {
      raw: true,
    }
  );

  React.useEffect(() => {
    const storageListener = () => {
      const storageMode = localStorage.getItem(PREVIEW_MODE_STORAGE_NAME);
      if (storageMode) {
        setMode(storageMode as "light" | "dark");
      }
    };
    window.addEventListener("storage", storageListener);
    return () => {
      window.removeEventListener("storage", storageListener);
    };
  }, [setMode]);

  return (
    <ModeProviderContext
      value={{
        mode:
          mode ??
          (resolvedTheme && ["light", "dark"].includes(resolvedTheme)
            ? (resolvedTheme as "light" | "dark")
            : null),
        setMode,
      }}
    >
      {children}
    </ModeProviderContext>
  );
}

export function usePreviewMode() {
  const context = React.useContext(ModeProviderContext);
  if (!context) {
    throw new Error("useMode must be used within a ModeProvider");
  }

  const mode = context.mode;
  const setMode = (mode: "light" | "dark") => {
    context.setMode(mode);
    document.cookie = `${PREVIEW_MODE_STORAGE_NAME}=${mode}; path=/; max-age=${PREVIEW_MODE_COOKIE_MAX_AGE}`;
  };

  return { mode, setMode };
}
