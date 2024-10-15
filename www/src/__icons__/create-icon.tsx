import React, { forwardRef } from "react";
import { useConfig } from "@/hooks/use-config";

export const createIcon = (icons: {
  lucide: React.ElementType;
  remix: React.ElementType;
}) => {
  const Icon = forwardRef<HTMLElement, { className?: string }>((props, ref) => {
    const { iconLibrary } = useConfig();
    const IconComponent = icons[iconLibrary as keyof typeof icons];
    if (!IconComponent) {
      return null;
    }
    return <IconComponent {...props} ref={ref} />;
  });
  Icon.displayName = "Icon";
  return Icon;
};
