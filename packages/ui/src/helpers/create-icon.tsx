import * as React from "react";

import { Skeleton } from "../components/skeleton";
import { useCurrentStyle } from "./style-provider";
import type { iconLibraries } from "../../../registry-definition/dist/registry-icons";

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
      return (
        <LucideIcon
          ref={ref}
          strokeWidth={style.icons.strokeWidth}
          {...props}
        />
      );
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
        <Icon ref={ref} strokeWidth={style.icons.strokeWidth} {...props} />
      </React.Suspense>
    );
  });

  return IconComponent;
}
