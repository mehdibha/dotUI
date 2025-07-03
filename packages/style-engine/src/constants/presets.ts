export const DEFAULT_STYLES: {
  name: string;
  description: string;
  iconLibrary: string;
  fonts: Record<string, string> | null;
  variants: Record<string, string> | null;
}[] = [
  {
    name: "Modern Minimal",
    description:
      "Clean and minimal design with subtle shadows and modern typography",
    iconLibrary: "lucide",
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    variants: {
      button: "basic",
      modal: "basic",
      tabs: "basic",
      tooltip: "basic",
    },
  },
  {
    name: "Bold & Vibrant",
    description: "High-contrast design with vibrant colors and bold typography",
    iconLibrary: "lucide",
    fonts: {
      heading: "Poppins",
      body: "Poppins",
    },
    variants: {
      button: "brutalist",
      modal: "blur",
      tabs: "motion",
      tooltip: "motion",
    },
  },
  {
    name: "Elegant Professional",
    description: "Sophisticated design perfect for business applications",
    iconLibrary: "lucide",
    fonts: {
      heading: "Open Sans",
      body: "Open Sans",
    },
    variants: {
      button: "outline",
      modal: "basic",
      tabs: "basic",
      tooltip: "basic",
    },
  },
];
