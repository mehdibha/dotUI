import { forwardRef, createElement } from "react";
import type { IconNode, IconProps } from "@/types/icons";

const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
};

export const createIcon = (
  iconName: string,
  iconNode: IconNode,
  colorType: "stroke" | "fill" = "stroke",
  defaultLibraryAttributes: Record<string, string> = {}
) => {
  const Component = forwardRef<SVGSVGElement, IconProps>(
    ({ color = "currentColor", size = 24, strokeWidth = 2, children, ...rest }, ref) => {
      return createElement(
        "svg",
        {
          ...defaultAttributes,
          ...defaultLibraryAttributes,
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

export const createIconComponentString = (
  iconName: string,
  iconNode: IconNode,
  colorType: "stroke" | "fill" = "stroke",
  defaultLibraryAttributes: Record<string, string> = {}
) => {
  const attributes = {
    ...defaultAttributes,
    ...defaultLibraryAttributes,
  };

  const preset = `import { type SVGProps } from "react";

interface IconProps extends Partial<SVGProps<SVGSVGElement>> {
  size?: string | number;
}
  
export const ${getReactComponentName(iconName)} = ({ color = "currentColor", size = 24, ...rest }: IconProps) => {
  return (
    <svg
      ${Object.entries(attributes)
        .map(([key, value]) => `${key}="${value}"`)
        .join("\n      ")}
      width={size}
      height={size}
      ${colorType}={color}
      {...rest}
    >
      ${iconNode
        .map(
          ([tag, attrs]) =>
            `<${tag} ${Object.entries(attrs)
              .map(([key, value]) => `${key}="${value}"`)
              .join("")} />`
        )
        .join("\n      ")}
    </svg>
  );
};`;
  return preset;
};

const getReactComponentName = (iconName: string) => {
  return `${!/^[a-zA-Z]/.test(iconName) ? "I" : ""}${iconName.replace(/\s/g, "")}Icon`;
};
