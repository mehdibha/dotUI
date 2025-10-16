import React from "react";
import type { ButtonRenderProps } from "react-aria-components";

/**
 * Returns true if the button should be square, otherwise false.
 *
 */

export const useButtonAspect = (
  children:
    | React.ReactNode
    | ((
        values: ButtonRenderProps & { defaultChildren: React.ReactNode },
      ) => React.ReactNode),
  aspect: "default" | "square" | "auto",
): boolean => {
  if (aspect === "default" || aspect === "square") {
    return aspect === "square";
  }

  const getTextContent = (children: React.ReactNode): string => {
    return React.Children.toArray(children).reduce(
      (text: string, child: React.ReactNode): string => {
        if (typeof child === "string" || typeof child === "number") {
          return text + child;
        }
        if (React.isValidElement(child)) {
          if ((child.props as any).children) {
            return text + getTextContent((child.props as any).children);
          }
          return text;
        }
        return text;
      },
      "",
    );
  };

  // If children is a function, evaluate it with default render props
  const actualChildren =
    typeof children === "function"
      ? children({
          isPending: false,
          isPressed: false,
          isHovered: false,
          isFocused: false,
          isFocusVisible: false,
          isDisabled: false,
          defaultChildren: null,
        })
      : children;

  const textContent = getTextContent(actualChildren);

  return textContent.trim() === "";
};
