import React from "react";

export const FontLoader = ({
  children,
  font,
}: {
  children: React.ReactNode;
  font: string | string[];
}) => {
  const [fontLoaded, setFontLoaded] = React.useState(false);

  React.useEffect(() => {}, []);

  return <div>{children}</div>;
};
