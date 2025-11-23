"use client";

interface RenderNode {
  name: string;
  props: string[];
  children: Array<RenderNode | RenderText>;
}

interface RenderText {
  type: "text";
  value: string;
}

type RenderChild = RenderNode | RenderText;

export function renderTree(root: RenderNode) {
  return formatNode(root).trim();
}

function formatNode(node: RenderNode, indent = ""): string {
  const propStrings = node.props ?? [];
  let newlines =
    node.name.length + countChars(propStrings) > 40 ||
    propStrings.some((prop) => prop.includes("\n"));

  const renderedProps = propStrings
    .map((prop) => (newlines ? `\n${indent}  ${prop}` : ` ${prop}`))
    .join("");

  const renderedChildren =
    node.children?.map((child) => formatChild(child, indent + "  ")) ?? [];

  if (!renderedChildren.length) {
    return `${indent}<${node.name}${renderedProps}${
      newlines ? `\n${indent}` : ""
    } />`;
  }

  const singleChild =
    renderedChildren.length === 1 && !renderedChildren[0].includes("\n");
  if (singleChild && !newlines) {
    return `${indent}<${node.name}${renderedProps}>${renderedChildren[0].trimStart()}</${node.name}>`;
  }

  newlines = newlines || renderedChildren.some((child) => child.includes("\n"));

  const childrenBlock = renderedChildren.join("\n");
  return `${indent}<${node.name}${renderedProps}>\n${childrenBlock}\n${indent}</${node.name}>`;
}

function formatChild(child: RenderChild, indent: string) {
  if (isRenderText(child)) {
    return `${indent}${child.value}`;
  }
  return formatNode(child, indent);
}

function isRenderText(child: RenderChild): child is RenderText {
  return (child as RenderText).type === "text";
}

function countChars(elements: string[]) {
  return elements.reduce((acc, element) => {
    if (typeof element === "string") {
      return acc + element.replace(/\n/g, "").length;
    }
    return acc;
  }, 0);
}

