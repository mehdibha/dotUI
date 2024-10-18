interface ColorScale {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}
interface ThemeColors {
  base: {
    neutral: string;
    accent: string;
    success: string;
    warning: string;
    danger: string;
  };
  scales: {
    neutral: ColorScale;
    accent: ColorScale;
    success: ColorScale;
    warning: ColorScale;
    danger: ColorScale;
  };
}

export interface Theme {
  name: string;
  label: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  fonts: {
    heading: string;
    body: string;
  };
  iconLibrary: string;
  radius: number;
}
