import React from "react";

export const FontLoader = ({
  children,
}: {
  children: React.ReactNode;
  font: string | string[];
}) => {
  return <div>{children}</div>;
};
