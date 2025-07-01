import React from "react";
import { useAtom } from "jotai";
import { withImmer } from "jotai-immer";
import { atomWithStorage } from "jotai/utils";

interface State {
  currentStyleSlug: string;
  currentMode: "light" | "dark";
}

const preferencesAtom = withImmer(
  atomWithStorage<State>("user-preferences", {
    currentStyleSlug: "minimalist",
    currentMode: "dark",
  }),
);

export const usePreferences = () => {
  const [state, setState] = useAtom(preferencesAtom);

  const currentMode = React.useMemo(() => {
    return state.currentMode;
  }, [state.currentMode]);

  const setCurrentMode = (mode: "light" | "dark") => {
    setState((draft) => {
      draft.currentMode = mode;
    });
  };

  const currentStyleSlug = React.useMemo(() => {
    return state.currentStyleSlug;
  }, [state.currentStyleSlug]);

  const setCurrentStyleSlug = (styleSlug: string) => {
    setState((draft) => {
      draft.currentStyleSlug = styleSlug;
    });
  };

  return {
    currentMode,
    setCurrentMode,
    currentStyleSlug,
    setCurrentStyleSlug,
  };
};
