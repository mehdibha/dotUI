import React, { SVGProps } from "react";
import { useThemes } from "@/hooks/use-themes";
import { Icons } from "@/__registry__/icons/registry";

type IconProps = SVGProps<SVGSVGElement>;

export const createIcon = (name: string) => {
  const icon = Icons[name as keyof typeof Icons];
  if (!icon) {
    return null;
  }

  const Icon: React.FC<IconProps> = (props: IconProps) => {
    const { currentIconLibrary } = useThemes();

    if (!currentIconLibrary || !icon || !icon[currentIconLibrary]) return null;

    const IconComponent = icon[currentIconLibrary] as React.FC<IconProps>;

    return <IconComponent {...props} />;
  };
  return Icon;
};
