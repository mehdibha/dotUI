import { useStyles } from "@/modules/styles-2/atoms/styles-atom";
import { Theme } from "@/modules/styles-2/types";

interface ThemeProviderProps
  extends Omit<React.ComponentProps<"div">, "children" | "style"> {
  theme: Theme;
  children?: React.ReactNode;
}

export const ThemeProvider = ({
  theme,
  children,
  ...props
}: ThemeProviderProps) => {
  const { currentMode } = useStyles();

  const styleProps = Object.entries({
    ...(currentMode === "light" ? theme.light : theme.dark),
    ...theme.theme,
  }).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [`--${key}`]: value,
    }),
    {}
  );

  return (
    <div {...props} style={styleProps}>
      {children}
    </div>
  );
};
