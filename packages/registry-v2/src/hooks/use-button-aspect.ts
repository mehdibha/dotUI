import React from "react";

/**
 * Returns true if the button should be square, otherwise false.
 *
 */

export const useButtonAspect = <T extends Record<string, any> = any>(
  children:
    | React.ReactNode
    | ((values: T & { defaultChildren: React.ReactNode }) => React.ReactNode),
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

  // If children is a function, evaluate it with an empty object to get the rendered content
  const actualChildren =
    typeof children === "function"
      ? children({} as T & { defaultChildren: React.ReactNode })
      : children;

  const textContent = getTextContent(actualChildren);

  return textContent.trim() === "";
};
