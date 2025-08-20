import type { Metadata } from "next";

import { TypographyEditor } from "@/modules/styles/components/style-editor/style-typography-editor";

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

export default function TypographyPage() {
  return <TypographyEditor />;
}
