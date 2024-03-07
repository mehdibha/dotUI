// import type { SerializeOptions } from 'next-mdx-remote/dist/types'
import { MDXRemote } from "next-mdx-remote/rsc";
import type { SerializeOptions } from "node_modules/next-mdx-remote/dist/types";
import rehypeHighlight from "rehype-highlight";
import remarkCodeImport from "remark-code-import";
import { components } from "@/components/mdx-components";

// TODO: Improve types by replacing Buffer with VFileCompatible
export async function Mdx(props: { source: string }) {
  const options: SerializeOptions = {
    parseFrontmatter: true,
    mdxOptions: {
      // @ts-expect-error TODO: fix types for rehype plugins
      rehypePlugins: [rehypeHighlight],
      remarkPlugins: [remarkCodeImport],
    },
  };

  // TODO: use suspense or async component
  return <MDXRemote source={props.source} components={components} options={options} />;
}
