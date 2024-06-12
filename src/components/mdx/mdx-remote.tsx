import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { components } from "@/components/mdx/mdx-components";

export async function Mdx(props: { source: string }) {
  const options = {
    parseFrontmatter: false,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      // rehypePlugins: [rehypePrettyCode],
    },
  };

  return <MDXRemote source={props.source} components={components} options={options} />;
}
