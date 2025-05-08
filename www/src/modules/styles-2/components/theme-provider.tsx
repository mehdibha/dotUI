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
  return <div {...props}>{children}</div>;
};
