import type { Metadata } from "next";

import { Preview } from "@/components/preview";
import { StyleEditorHeader } from "@/modules/styles/components/style-editor/header";
import { StyleEditorNav } from "@/modules/styles/components/style-editor/nav";
import { StyleEditorForm } from "@/modules/styles/providers/style-editor-provider";
import { Providers } from "./providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="[&_[data-slot='label']]:text-fg-muted relative grid grid-cols-[1fr_auto] max-xl:grid-cols-1 [&_[data-slot='label']]:text-sm [&_[data-slot='label']]:font-medium">
        <div className="@container min-w-0 py-4 lg:py-10">
          <StyleEditorForm>
            <StyleEditorHeader />
            <StyleEditorNav className="mt-2">{children}</StyleEditorNav>
          </StyleEditorForm>
        </div>
        <div className="sticky top-0 flex h-[100svh] items-start max-xl:hidden">
          <Preview />
        </div>
      </div>
    </Providers>
  );
}
