import * as React from "react";

import { Skeleton } from "@dotui/registry/ui/skeleton";
import { useStyleConfig } from "@dotui/core/react";
import type { iconLibraries } from "@dotui/registry/icons/registry";

interface CommonIconProps extends React.RefAttributes<SVGSVGElement> {
  className?: string;
  width?: string | number;
  height?: string | number;
  size?: string | number;
  style?: React.CSSProperties;
  fill?: string;
  stroke?: string;
  strokeWidth?: string | number;
  onClick?: (event: React.MouseEvent<SVGSVGElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<SVGSVGElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<SVGSVGElement>) => void;
  "aria-label"?: string;
  "aria-hidden"?: React.AriaAttributes["aria-hidden"];
  role?: string;
}

type IconComponent = React.ComponentType<CommonIconProps>;
type IconLibraryName = (typeof iconLibraries)[number]["name"];

// Use a more permissive type for lazy-loaded icons since different libraries have different type signatures
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LazyIconComponent = React.LazyExoticComponent<React.ComponentType<any>>;

type IconMapping = {
  lucide: IconComponent;
} & Record<Exclude<IconLibraryName, "lucide">, LazyIconComponent>;

export type { CommonIconProps };

export function createIcon(iconMapping: IconMapping): IconComponent {
  const IconComponent: IconComponent = React.forwardRef<
    SVGSVGElement,
    React.SVGProps<SVGSVGElement>
  >((props, ref) => {
    const styleConfig = useStyleConfig();

    const LucideIcon = iconMapping.lucide;
    if (!styleConfig) {
      return <LucideIcon ref={ref} {...props} />;
    }

    const { icons } = styleConfig;
    const iconLibrary = icons.library;

    if (iconLibrary === "lucide") {
      return (
        <LucideIcon
          ref={ref}
          strokeWidth={icons.strokeWidth}
          {...props}
        />
      );
    }

    const Icon = iconMapping[iconLibrary as keyof IconMapping];
    return (
      <React.Suspense
        fallback={
          <Skeleton>
            <LucideIcon ref={ref} {...props} />
          </Skeleton>
        }
      >
        <Icon ref={ref} strokeWidth={icons.strokeWidth} {...props} />
      </React.Suspense>
    );
  });

  return IconComponent;
}
