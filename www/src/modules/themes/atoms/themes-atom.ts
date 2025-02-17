import { useAtom } from "jotai";
import { withImmer } from "jotai-immer";
import { atomWithStorage } from "jotai/utils";
// import { nanoid } from "nanoid";
import { themes } from "@/registry/registry-themes";
import { minimalistTheme } from "@/registry/themes/minimalist";
import { Theme } from "@/modules/themes/types";

type State = {
  userThemes: Theme[];
  currentTheme: string;
  currentMode: "light" | "dark";
};

const themesAtom = withImmer(
  atomWithStorage<State>("new-themes", {
    userThemes: [],
    currentTheme: "minimalist",
    currentMode: "dark",
  })
);

export const useUserThemes = () => {
  const [state, setState] = useAtom(themesAtom);

  const createTheme = async (name: string) => {
    if (
      state.userThemes.find(
        (t) => t.name === name.toLowerCase().replace(" ", "-")
      )
    ) {
      throw new Error("Theme already exists");
    }
    await new Promise((resolve) => setTimeout(resolve, 500));

    setState((draft) => {
      draft.userThemes.push({
        ...minimalistTheme,
        name: name.toLowerCase().replace(" ", "-"),
        label: name,
      });
    });
  };

  const updateTheme = (theme: Theme) => {
    setState((draft) => {
      const index = draft.userThemes.findIndex((t) => t.name === theme.name);
      if (index !== -1) {
        draft.userThemes[index] = theme;
      }
    });
  };

  return {
    userThemes: state.userThemes,
    createTheme,
    updateTheme,
  };
};

export const useCurrentTheme = (): { currentTheme: Theme } => {
  const [state] = useAtom(themesAtom);
  const { currentTheme: currentThemeName } = state;

  const allThemes = [...state.userThemes, ...themes];

  const currentTheme = allThemes.find((t) => t.name === currentThemeName)!;

  return { currentTheme };
};
