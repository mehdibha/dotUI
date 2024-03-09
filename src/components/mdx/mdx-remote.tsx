"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { components } from "@/components/mdx/mdx-components";
// import rehypeHighlight from "rehype-highlight";
// import remarkCodeImport from "remark-code-import";

export function Mdx({ source }: { source: MDXRemoteSerializeResult }) {
  // const options = {
  //   parseFrontmatter: true,
  //   mdxOptions: {
  //     rehypePlugins: [rehypeHighlight],
  //     remarkPlugins: [remarkCodeImport],
  //   },
  // };

  return <MDXRemote {...source} components={components} />;
}
