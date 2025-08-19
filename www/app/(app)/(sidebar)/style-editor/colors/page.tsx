import type { Metadata } from "next";

import { ColorsEditor } from "@/modules/styles/components/style-editor/colors-editor";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ username: string; stylename: string }>;
}): Promise<Metadata> {
  const { stylename } = await searchParams;
  return {
    title: `${stylename} style`,
  };
}

export default function StyleColorsPage() {
  return <ColorsEditor />;
}
