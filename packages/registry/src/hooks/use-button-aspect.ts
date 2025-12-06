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

  const actualChildren =
    typeof children === "function"
      ? children({} as T & { defaultChildren: React.ReactNode })
      : children;

  const traverseChildren = (
    children: React.ReactNode,
  ): { hasSelectValue: boolean; textContent: string } => {
    let hasSelectValue = false;
    let textContent = "";

    React.Children.toArray(children).forEach((child) => {
      if (typeof child === "string" || typeof child === "number") {
        textContent += String(child);
        return;
      }

      if (React.isValidElement(child)) {
        const componentType = child.type as any;
        if (componentType?.name === "SelectValue") {
          hasSelectValue = true;
        }

        const props = child.props as { children?: React.ReactNode };
        if (props.children) {
          const result = traverseChildren(props.children);
          hasSelectValue ||= result.hasSelectValue;
          textContent += result.textContent;
        }
      }
    });

    return { hasSelectValue, textContent };
  };

  const { hasSelectValue, textContent } = traverseChildren(actualChildren);

  if (hasSelectValue) {
    return false;
  }

  return textContent.trim() === "";
};
