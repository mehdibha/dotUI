import React from "react";

export const useIconOnly = (
  children: React.ReactNode | ((renderProps: any) => React.ReactNode),
): boolean => {
  return React.useMemo(() => {
    // Handle function children (from composeRenderProps)
    const content = typeof children === "function" ? children({}) : children;

    let hasText = false;

    function checkChildren(childNodes: React.ReactNode): void {
      React.Children.forEach(childNodes, (child) => {
        // Check for non-empty string (text content)
        if (typeof child === "string" && child.trim() !== "") {
          hasText = true;
        }
        // Check for numbers (also text content)
        else if (typeof child === "number") {
          hasText = true;
        }
        // Recursively check React elements
        else if (React.isValidElement(child) && child.props.children) {
          checkChildren(child.props.children);
        }
      });
    }

    checkChildren(content);

    // Only return true if we have content and it's not text
    const hasContent = React.Children.count(content) > 0;
    return hasContent && !hasText;
  }, [children]);
};