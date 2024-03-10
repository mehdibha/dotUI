import { MDXRemote } from "next-mdx-remote/rsc";
import { components } from "@/components/mdx/mdx-components";

export async function Mdx(props: { source: string }) {
  const options = {
    parseFrontmatter: false,
  };

  return <MDXRemote source={props.source} components={components} options={options} />;
}
