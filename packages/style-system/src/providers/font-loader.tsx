const builtInFonts = [
  "Geist",
  "Geist Mono",
  "Inter",
  "Roboto",
  "Josefin Sans",
  "Open Sans",
  "Montserrat",
  "Raleway",
  "Work Sans",
  "DM Sans",
  "Nunito",
];

export function FontLoader({ font }: { font: string | null | undefined }) {
  if (!font || builtInFonts.includes(font)) return null;
  const googleFontUrl = generateGoogleFontUrl(font);
  return <link href={googleFontUrl} rel="stylesheet" />;
}

function generateGoogleFontUrl(font: string) {
  const familyName = font.replace(/\s+/g, "+");
  return `https://fonts.googleapis.com/css?family=${familyName}&display=swap`;
}
