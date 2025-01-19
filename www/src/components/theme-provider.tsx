//    This component will provide:
// - CSS variables for the theme
// - Import required fonts
// - Provide the variants for components
import { useThemes } from "@/hooks/use-themes";

interface ThemeProviderProps extends React.ComponentProps<"div"> {
  name?: string;
}
const ThemeProvider = (props: ThemeProviderProps) => {
  return <div></div>;
};


const useThemeCSSVars = (name?: string) => {
  const { themes } = useThemes();
};
