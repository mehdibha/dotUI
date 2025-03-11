import { useAtom } from "jotai";
import { withImmer } from "jotai-immer";
import { atomWithStorage } from "jotai/utils";
import { themes } from "@/registry/registry-themes";
import { Theme } from "@/modules/themes/types";

type State = {
  userThemes: Theme[];
  currentTheme: string;
};

const themesAtom = withImmer(
  atomWithStorage<State>("new-themes", {
    userThemes: [],
    currentTheme: "minimalist",
  })
);

export const useUserThemes = () => {
  const [state, setState] = useAtom(themesAtom);

  const allThemes = [...state.userThemes, ...themes];

  const createTheme = async (
    themeName: string,
    clonedTheme: string = "minimalist"
  ) => {
    if (
      state.userThemes.find(
        (t) => t.name === themeName.toLowerCase().replace(" ", "-")
      )
    ) {
      throw new Error("Theme already exists");
    }
    await new Promise((resolve) => setTimeout(resolve, 500));

    setState((draft) => {
      draft.userThemes.push({
        ...allThemes.find((t) => t.name === clonedTheme)!,
        name: themeName.toLowerCase().replace(" ", "-"),
        label: themeName,
      });
    });
  };

  const updateTheme = async (theme: Theme) => {
    setState((draft) => {
      const index = draft.userThemes.findIndex((t) => t.name === theme.name);
      if (index !== -1) {
        draft.userThemes[index] = theme;
      }
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const deleteTheme = async (themeName: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setState((draft) => {
      draft.userThemes = draft.userThemes.filter((t) => t.name !== themeName);
    });
  };

  const setCurrentTheme = async (themeName: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setState((draft) => {
      draft.currentTheme = themeName;
    });
  };

  return {
    userThemes: state.userThemes,
    currentThemeName: state.currentTheme,
    createTheme,
    updateTheme,
    deleteTheme,
    setCurrentTheme,
  };
};

export const useCurrentTheme = (): { currentTheme: Theme } => {
  const [state] = useAtom(themesAtom);
  const { currentTheme: currentThemeName } = state;

  const allThemes = [...state.userThemes, ...themes];

  const currentTheme = allThemes.find((t) => t.name === currentThemeName)!;

  return { currentTheme };
};
