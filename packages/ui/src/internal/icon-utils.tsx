"use client";

import * as React from "react";

import type { iconLibraries } from "@dotui/registry-definition/registry-icons";

import { Skeleton } from "../components/skeleton";
import { useCurrentStyle } from "./style-provider";

interface CommonIconProps extends React.RefAttributes<any> {
  className?: string;
  width?: string | number;
  height?: string | number;
  size?: string | number;
  style?: React.CSSProperties;
  fill?: string;
  stroke?: string;
  strokeWidth?: string | number;
  onClick?: (event: React.MouseEvent<any>) => void;
  onMouseEnter?: (event: React.MouseEvent<any>) => void;
  onMouseLeave?: (event: React.MouseEvent<any>) => void;
  "aria-label"?: string;
  "aria-hidden"?: React.AriaAttributes["aria-hidden"];
  role?: string;
}

type IconComponent = React.ComponentType<CommonIconProps>;
type IconLibraryName = (typeof iconLibraries)[number]["name"];

type IconMapping = {
  lucide: IconComponent;
} & Record<
  Exclude<IconLibraryName, "lucide">,
  React.LazyExoticComponent<IconComponent>
>;

export type { CommonIconProps };

export function createIcon(iconMapping: IconMapping): IconComponent {
  const IconComponent: IconComponent = React.forwardRef<
    SVGSVGElement,
    React.SVGProps<SVGSVGElement>
  >((props, ref) => {
    const style = useCurrentStyle();

    const LucideIcon = iconMapping.lucide;
    if (!style) {
      return <LucideIcon ref={ref} {...props} />;
    }

    const iconLibrary = style.icons.library;

    if (iconLibrary === "lucide") {
      return <LucideIcon ref={ref} {...props} />;
    }

    const Icon = iconMapping[iconLibrary];
    return (
      <React.Suspense
        fallback={
          <Skeleton>
            <LucideIcon ref={ref} {...props} />
          </Skeleton>
        }
      >
        <Icon ref={ref} {...props} />
      </React.Suspense>
    );
  });

  return IconComponent;
}
