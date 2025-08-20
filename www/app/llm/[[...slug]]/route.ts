import { notFound } from "next/navigation";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { docsSource } from "@/modules/docs/lib/source";

export const revalidate = false;

export async function GET(
  request: NextRequest,
  { params }: RouteContext<"/llm/[[...slug]]">,
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
  const params = docsSource.generateParams();
  return params.map((param) => ({
    slug: Array.isArray(param.slug) ? param.slug : [param.slug],
  }));
}
