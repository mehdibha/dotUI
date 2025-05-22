import { useTheme } from "next-themes";
import { useStyles } from "@/modules/styles/atoms/styles-atom";
import { Theme } from "@/modules/styles/types";

export interface ThemeProviderProps
  extends Omit<React.ComponentProps<"div">, "children" | "style"> {
  theme: Theme;
  mode?: "light" | "dark" | "site" | "storage";
  children?: React.ReactNode;
}

export const ThemeProvider = ({
  theme,
  mode = "storage",
  children,
  ...props
}: ThemeProviderProps) => {
  const { currentMode } = useStyles();
  const { resolvedTheme } = useTheme();
  const resolvedMode =
    mode === "site" ? resolvedTheme : mode === "storage" ? currentMode : mode;

  const styleProps = Object.entries({
    ...(resolvedMode === "light" ? theme.light : theme.dark),
    ...theme.theme,
  }).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [`--${key}`]: value,
    }),
    {}
  );

  return (
    <div className="bg-bg text-fg" {...props} style={styleProps}>
      {children}
    </div>
  );
};
