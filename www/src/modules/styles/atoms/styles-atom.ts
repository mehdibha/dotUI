import React from "react";
import { useAtom } from "jotai";
import { withImmer } from "jotai-immer";
import { atomWithStorage } from "jotai/utils";
import { styles } from "@/modules/registry/registry-styles";

// import { StyleFoundations } from "@/modules/styles/types";

type State = {
  currentStyleName: string;
  currentMode: "light" | "dark";
};

const stylesAtom = withImmer(
  atomWithStorage<State>("new-styles", {
    currentStyleName: "material",
    currentMode: "dark",
  })
);

export const useStyles = () => {
  const [state, setState] = useAtom(stylesAtom);

  const currentMode = React.useMemo(() => {
    return state.currentMode;
  }, [state.currentMode]);

  const setCurrentMode = async (mode: "light" | "dark") => {
    setState((draft) => {
      draft.currentMode = mode;
    });
  };

  const currentStyle = React.useMemo(
    () => styles.find((style) => style.name === state.currentStyleName)!,
    [state.currentStyleName]
  );

  const setCurrentStyle = async (styleName: string) => {
    setState((draft) => {
      draft.currentStyleName = styleName;
    });
  };

  return {
    currentMode,
    setCurrentMode,
    currentStyle,
    setCurrentStyle,
  };
};
