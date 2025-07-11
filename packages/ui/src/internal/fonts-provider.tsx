import type { Fonts } from "@dotui/style-engine/types";

export const FontsProvider = ({
  children,
  fonts,
}: {
  children: React.ReactNode;
  fonts: Fonts;
}) => {
  return (
    <>
      <FontLoader font={fonts.heading} />
      <FontLoader font={fonts.body} />
      <div
        className="font-body"
        style={
          {
            "--font-heading": fonts.heading,
            "--font-body": fonts.body,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </>
  );
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
