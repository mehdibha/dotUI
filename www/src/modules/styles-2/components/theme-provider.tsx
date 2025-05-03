import { Theme } from "@/modules/styles-2/types";

export const ThemeProvider = ({
  theme,
  children,
}: {
  theme: Theme;
  children?: React.ReactNode;
}) => {
  console.log(theme);
  return <div>{children}</div>;
};
