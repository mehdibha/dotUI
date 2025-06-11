import type { Root } from "mdast";
import type { Transformer } from "unified";
import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";

// Walkaround for inline code to set default language
export default function remarkInlineCode(): Transformer<Root, Root> {
  return (tree) => {
    visit(tree, "inlineCode", (node) => {
      const raw = toString(node as any);
      const match = /(.+)\{:([\w-]+)\}$/.exec(raw);
      node.value = match?.[2] ? node.value : `${node.value}{:tsx}`;
    });
  };
}
