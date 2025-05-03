import { Fonts } from "@/modules/styles-2/types";

export const FontsProvider = ({
  children,
  fonts,
}: {
  children: React.ReactNode;
  fonts: Fonts;
}) => {
  console.log(fonts);
  return children;
};

export function FontLoader({ font }: { font: string | null | undefined }) {
  if (!font) return null;
  const googleFontUrl = generateGoogleFontUrl(font);
  return <link href={googleFontUrl} rel="stylesheet" />;
}

function generateGoogleFontUrl(font: string) {
  const familyName = font.replace(/\s+/g, "+");

  return `https://fonts.googleapis.com/css?family=${familyName}`;
}
