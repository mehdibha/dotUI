import type { Metadata } from "next";

import { ComponentsEditor } from "@/modules/styles/components/style-editor/components-editor";

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

export default function ComponentsPage() {
  return <ComponentsEditor />;
}
