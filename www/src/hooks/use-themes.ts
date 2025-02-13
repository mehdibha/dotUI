import { useAtom } from "jotai";
import { withImmer } from "jotai-immer";
import { atomWithStorage } from "jotai/utils";
import { nanoid } from "nanoid";
import { buildColorScales } from "@/lib/colors";
import { defaultTheme, dotUIThemes } from "@/lib/themes";
import { useMounted } from "@/hooks/use-mounted";
import { BaseColor, Theme } from "@/types/theme";

type Mode = "light" | "dark";

type State = {
  themes: Theme[];
  currentThemeId: string;
  mode: Mode;
  showKeyboardHint: boolean;
};

const themesAtom = withImmer(
  atomWithStorage<State>("themes", {
    themes: [],
    mode: "light",
    currentThemeId: "default",
    showKeyboardHint: true,
  })
);

export const useThemes = () => {
  const [state, setState] = useAtom(themesAtom);
  const mounted = useMounted();

  const currentTheme = [...state.themes, ...dotUIThemes].find(
    (t) => t.id === state.currentThemeId
  ) as Theme;

  const isCurrentThemeEditable = state.themes.some(
    (t) => t.id === state.currentThemeId
  );

  const setCurrentThemeId = (themeId: string) => {
    setState((draft) => {
      draft.currentThemeId = themeId;
      const theme = [...draft.themes, ...dotUIThemes].find(
        (t) => t.id === themeId
      );
      if (theme && theme.defaultMode) {
        console.log("setting mode", theme.defaultMode);
        draft.mode = theme.defaultMode;
      }
    });
  };

  const setMode = (mode: Mode) => {
    setState((draft) => {
      draft.mode = mode;
      const currentTheme = draft.themes.find(
        (t) => t.id === draft.currentThemeId
      );
      if (currentTheme) {
        currentTheme.defaultMode = mode;
      }
    });
  };

  const createTheme = (
    themeProperties: Prettify<
      Omit<Partial<Theme>, "id" | "name"> & { name: string }
    >
  ) => {
    setState((draft) => {
      const id = nanoid();
      // @ts-expect-error TODO
      draft.themes.push({
        ...defaultTheme,
        ...themeProperties,
        id,
      });
      draft.currentThemeId = id;
    });
  };

  const cloneTheme = (
    themeId: string,
    themeProps: Prettify<Omit<Partial<Theme>, "id"> & { name: string }>
  ) => {
    const theme = [...state.themes, ...dotUIThemes].find(
      (t) => t.id === themeId
    );
    if (!theme) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, name, ...targetThemeProps } = theme;
    createTheme({
      ...targetThemeProps,
      ...themeProps,
    });
  };

  const deleteTheme = (themeId: string) => {
    setState((draft) => {
      draft.currentThemeId = "default";
      draft.themes = draft.themes.filter((t) => t.id !== themeId);
    });
  };

  const setThemeName = (name: string) => {
    setState((draft) => {
      const theme = draft.themes.find((t) => t.id === draft.currentThemeId);
      if (theme) {
        theme.name = name;
      }
    });
  };

  const handleBaseColorChange = (baseColor: BaseColor, value: string) => {
    if (!isCurrentThemeEditable) return;
    setState((draft) => {
      const theme = draft.themes.find((t) => t.id === draft.currentThemeId);
      if (theme) {
        theme.colors[state.mode][baseColor].baseColor = value;
        const currentColors = theme.colors[state.mode];
        const modeConfig = buildColorScales({
          neutral: { baseColors: [currentColors.neutral.baseColor] },
          warning: { baseColors: [currentColors.warning.baseColor] },
          success: { baseColors: [currentColors.success.baseColor] },
          danger: { baseColors: [currentColors.danger.baseColor] },
          accent: { baseColors: [currentColors.accent.baseColor] },
          lightness: currentColors.lightness,
          saturation: currentColors.saturation,
          mode: state.mode,
        });
        theme.colors[state.mode] = modeConfig;
      }
    });
  };

  const handleColorConfigChange = (
    config: "lightness" | "saturation",
    value: number
  ) => {
    if (!isCurrentThemeEditable) return;
    setState((draft) => {
      if (config === "lightness" && state.mode === "light" && value < 50)
        value = 50;
      if (config === "lightness" && state.mode === "dark" && value > 49)
        value = 49;
      const theme = draft.themes.find((t) => t.id === draft.currentThemeId);
      if (theme) {
        theme.colors[state.mode][config] = value;
        const currentColors = theme.colors[state.mode];
        const modeConfig = buildColorScales({
          neutral: { baseColors: [currentColors.neutral.baseColor] },
          warning: { baseColors: [currentColors.warning.baseColor] },
          success: { baseColors: [currentColors.success.baseColor] },
          danger: { baseColors: [currentColors.danger.baseColor] },
          accent: { baseColors: [currentColors.accent.baseColor] },
          lightness: currentColors.lightness,
          saturation: currentColors.saturation,
          mode: state.mode,
        });
        theme.colors[state.mode] = modeConfig;
      }
    });
  };

  const fonts = currentTheme.fonts;

  const handleFontChange = (font: "heading" | "body", value: string) => {
    if (!isCurrentThemeEditable) return;
    setState((draft) => {
      const theme = draft.themes.find((t) => t.id === draft.currentThemeId);
      if (theme) {
        theme.fonts[font] = value;
      }
    });
  };

  const handleRadiusChange = (value: number) => {
    if (!isCurrentThemeEditable) return;
    setState((draft) => {
      const theme = draft.themes.find((t) => t.id === draft.currentThemeId);
      if (theme) {
        theme.radius = value;
      }
    });
  };

  const updateVariant = (variant: string, value: string) => {
    if (!isCurrentThemeEditable) return;
    setState((draft) => {
      const theme = draft.themes.find((t) => t.id === draft.currentThemeId);
      if (theme) {
        theme.variants[variant] = value;
      }
    });
  };

  const showKeyboardHint = state.showKeyboardHint;
  const setShowKeyboardHint = (value: boolean) => {
    setState((draft) => {
      draft.showKeyboardHint = value;
    });
  };

  return {
    isLoading: !mounted,
    themes: state.themes,
    mode: state.mode,
    currentTheme,
    isCurrentThemeEditable,
    createTheme,
    cloneTheme,
    setThemeName,
    currentThemeId: state.currentThemeId,
    setCurrentThemeId,
    setMode,
    handleBaseColorChange,
    handleColorConfigChange,
    handleFontChange,
    fonts,
    currentIconLibrary: currentTheme.iconLibrary,
    radius: currentTheme.radius,
    handleRadiusChange,
    deleteTheme,
    showKeyboardHint,
    setShowKeyboardHint,
    currentVariants: currentTheme.variants,
    updateVariant,
  };
};
