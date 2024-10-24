import React, { forwardRef } from "react";

export const createIcon = (icons: {
  lucide: React.ElementType;
  remix: React.ElementType;
}) => {
  const Icon = forwardRef<HTMLElement, { className?: string }>((props, ref) => {
    // TODO: get icon library from config
    const iconLibrary = "lucide";
    const IconComponent = icons[iconLibrary as keyof typeof icons];
    if (!IconComponent) {
      return null;
    }
    return <IconComponent {...props} ref={ref} />;
  });
  Icon.displayName = "Icon";
  return Icon;
};
