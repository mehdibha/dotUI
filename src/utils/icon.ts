import { forwardRef, createElement } from "react";
import type { IconNode, IconProps } from "@/types/icons";

// TODO: add keys for icons
export const createIcon = (
  iconName: string,
  iconNode: IconNode,
  colorType: "stroke" | "fill" = "stroke"
) => {
  const Component = forwardRef<SVGSVGElement, IconProps>(
    ({ color = "currentColor", size = 24, strokeWidth = 2, children, ...rest }, ref) => {
      return createElement(
        "svg",
        {
          ref,
          width: size,
          height: size,
          stroke: colorType === "stroke" ? color : undefined,
          fill: colorType === "fill" ? color : undefined,
          strokeWidth: strokeWidth,
          ...rest,
        },
        [
          ...iconNode.map(([tag, attrs]) => createElement(tag, attrs)),
          // TODO: Fix this type issue
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          ...(Array.isArray(children) ? children : [children]),
        ]
      );
    }
  );
  Component.displayName = `${iconName}`;
  return Component;
};
