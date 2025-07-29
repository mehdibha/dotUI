import React from "react";
import { useAtom } from "jotai";
import { withImmer } from "jotai-immer";
import { atomWithStorage } from "jotai/utils";

interface State {
  activeStyleId: string | null;
  activeMode: "light" | "dark";
}

const preferencesAtom = withImmer(
  atomWithStorage<State>("user-preferences", {
    activeStyleId: null,
    activeMode: "dark",
  }),
);

export const usePreferences = () => {
  const [state, setState] = useAtom(preferencesAtom);

  const activeMode = React.useMemo(() => {
    return state.activeMode;
  }, [state.activeMode]);

  const setActiveMode = (mode: "light" | "dark") => {
    setState((draft) => {
      draft.activeMode = mode;
    });
  };

  const activeStyleId = React.useMemo(() => {
    return state.activeStyleId;
  }, [state.activeStyleId]);

  const setActiveStyleId = (styleSlug: string) => {
    setState((draft) => {
      draft.activeStyleId = styleSlug;
    });
  };

  return {
    activeMode,
    setActiveMode,
    activeStyleId,
    setActiveStyleId,
  };
};
