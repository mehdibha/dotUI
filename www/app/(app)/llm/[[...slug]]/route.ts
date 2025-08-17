import { notFound } from "next/navigation";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { docsSource } from "@/modules/docs/lib/source";

export const revalidate = false;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const slug = (await params).slug;
  const page = docsSource.getPage(slug);

  if (!page) {
    notFound();
  }

  return new NextResponse(page.data.content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}

export function generateStaticParams() {
  return docsSource.generateParams();
}
