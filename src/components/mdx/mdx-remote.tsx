import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { components } from "@/components/mdx/icons-explorer/mdx-components";

export async function Mdx(props: { source: string }) {
  const options = {
    parseFrontmatter: false,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
  };

  return <MDXRemote source={props.source} components={components} options={options} />;
}
