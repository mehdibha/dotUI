export function FontLoader({ font }: { font: string | null | undefined }) {
  if (!font) return null;
  const googleFontUrl = generateGoogleFontUrl(font);
  return <link href={googleFontUrl} rel="stylesheet" />;
}

function generateGoogleFontUrl(font: string) {
  const familyName = font.replace(/\s+/g, "+");

  return `https://fonts.googleapis.com/css?family=${familyName}`;
}
