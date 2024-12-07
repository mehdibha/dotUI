// @ts-nocheck
// TODO: fix types
import React, { forwardRef } from "react";
import { useThemes } from "@/hooks/use-themes";
import { Icons } from "@/__registry__/icons/registry";

export const createIcon = (name: string) => {
  const icon = Icons[name as keyof typeof Icons];
  if (!icon) {
    return null;
  }

  const Icon = forwardRef<HTMLElement, { className?: string }>((props, ref) => {
    const { currentIconLibrary } = useThemes();

    if (!currentIconLibrary || !icon || !icon[currentIconLibrary]) return null;

    const IconComponent = icon[currentIconLibrary];

    return <IconComponent {...props} ref={ref} />;
  });
  Icon.displayName = "Icon";
  return Icon;
};
