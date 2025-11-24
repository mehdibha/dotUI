"use client";

import type { RenderChild, RenderNode, RenderText } from "./types";

export function renderTree(root: RenderNode) {
  return formatNode(root).trim();
}

function formatNode(node: RenderNode, indent = ""): string {
  const propStrings = node.props ?? [];
  const newlines =
    node.name.length + countChars(propStrings) > 40 ||
    propStrings.some((prop) => prop.includes("\n"));

  let renderedProps = propStrings
    .map((prop) => (newlines ? `\n  ${indent}${prop}` : ` ${prop}`))
    .join("");
  if (newlines) {
    renderedProps += `\n${indent}`;
  }

  const renderedChildren =
    node.children?.map((child, index) =>
      formatChild(child, indent, renderedProps ? index > 0 : false),
    ) ?? [];

  if (!renderedChildren.length) {
    return `${indent}<${node.name}${renderedProps}${newlines ? `\n${indent}` : ""} />`;
  }

  const singleChild =
    renderedChildren.length === 1 && !renderedChildren[0].includes("\n");
  if (
    singleChild &&
    !newlines &&
    renderedProps === propStrings.map((prop) => ` ${prop}`).join("")
  ) {
    return `${indent}<${node.name}${renderedProps}>${renderedChildren[0].trimStart()}</${node.name}>`;
  }

  const childrenBlock = renderedChildren.join("\n");
  return [
    `${indent}<${node.name}${renderedProps}>`,
    childrenBlock,
    `${indent}</${node.name}>`,
  ].join("\n");
}

function formatChild(
  child: RenderChild,
  indent: string,
  precedingNewline: boolean,
) {
  const newIndent = indent + "  ";
  if (isRenderText(child)) {
    return `${precedingNewline ? "\n" : ""}${newIndent}${child.value}`;
  }
  const formatted = formatNode(child, newIndent);
  return precedingNewline ? `\n${formatted}` : formatted;
}

function isRenderText(child: RenderChild): child is RenderText {
  return child.type === "text";
}

function countChars(elements: string[]) {
  return elements.reduce((acc, element) => {
    if (typeof element === "string") {
      return acc + element.replace(/\n/g, "").length;
    }
    return acc;
  }, 0);
}
