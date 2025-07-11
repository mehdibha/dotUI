import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  CodeIcon,
  RocketIcon,
  RotateCcwIcon,
  SettingsIcon,
} from "lucide-react";

import { Button } from "@dotui/ui/components/button";

import { Preview, PreviewProvider } from "@/components/preview";
import { StyleNav } from "@/modules/styles/components/style-nav";
import { StyleFormProvider } from "@/modules/styles/lib/form-context";
import { getQueryClient, trpc } from "@/trpc/server";
import { StyleActions } from "./actions";
import StyleForm from "./form";

export default async function StylePage({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ style: string }>;
}) {
  const { style: styleSlug } = await params;

  const queryClient = getQueryClient();
  const style = await queryClient.fetchQuery(
    trpc.style.bySlug.queryOptions({ slug: styleSlug }),
  );

  if (!style) {
    notFound();
  }

  return (
    <PreviewProvider>
      <StyleFormProvider>
        <div className="relative grid grid-cols-[1fr_auto] max-xl:grid-cols-1 [&_[data-slot='label']]:text-sm [&_[data-slot='label']]:font-medium [&_[data-slot='label']]:text-fg-muted">
          <div className="container max-w-5xl py-10">
            <Link
              href="/styles"
              className="flex items-center gap-1 text-sm text-fg-muted hover:text-fg"
            >
              <ArrowLeftIcon className="size-4" /> styles
            </Link>
            <StyleForm>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="mt-1 text-2xl font-bold">{style.name}</h1>
                  <p className="text-sm text-fg-muted">{style.description}</p>
                </div>
                <div className="flex items-center gap-1">
                  <StyleActions />
                </div>
              </div>
            </StyleForm>
            <StyleNav className="mt-2">{children}</StyleNav>
          </div>
          <div className="sticky top-0 flex h-[100svh] items-start max-xl:hidden">
            <Preview />
          </div>
        </div>
      </StyleFormProvider>
    </PreviewProvider>
  );
}
