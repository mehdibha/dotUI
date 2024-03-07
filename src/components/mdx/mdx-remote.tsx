import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import remarkCodeImport from "remark-code-import";
import { components } from "@/components/mdx/mdx-components";

export async function Mdx(props: { source: string }) {
  const options = {
    parseFrontmatter: true,
    mdxOptions: {
      rehypePlugins: [rehypeHighlight],
      remarkPlugins: [remarkCodeImport],
    },
  };

  // @ts-expect-error TODO fix this later
  return <MDXRemote source={props.source} components={components} options={options} />;
}
