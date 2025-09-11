import type { Metadata } from "next";

import { IconsEditor } from "@/modules/style-editor/components/icons-editor";

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

export default function IconsPage() {
  return <IconsEditor />;
}
