import { Style, Theme } from "@/modules/styles-2/types";

export const ThemeProvider = ({
  theme,
  children,
}: {
  theme: Theme;
  children?: React.ReactNode;
}) => {
  return <div>{children}</div>;
};
