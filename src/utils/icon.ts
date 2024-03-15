import { forwardRef, createElement } from "react";
import type { IconNode, IconProps } from "@/types/icons";

export const createIcon = (iconName: string, iconNode: IconNode) => {
  const Component = forwardRef<SVGSVGElement, IconProps>(
    (
      {
        color = "currentColor",
        size = 24,
        strokeWidth = 2,
        absoluteStrokeWidth,
        children,
        ...rest
      },
      ref
    ) => {
      return createElement(
        "svg",
        {
          ref,
          // ...defaultAttributes,
          width: size,
          height: size,
          stroke: color,
          strokeWidth: absoluteStrokeWidth
            ? (Number(strokeWidth) * 24) / Number(size)
            : strokeWidth,
          // className: ["lucide", `lucide-${toKebabCase(iconName)}`, className].join(" "),
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
