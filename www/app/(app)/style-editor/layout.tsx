import { DraftStyleSync } from "@/modules/style-editor/components/draft-style-sync";
import { Preview } from "@/modules/style-editor/components/preview";
import { StyleEditorForm } from "@/modules/style-editor/components/style-editor-form";
import { StyleEditorHeader } from "@/modules/style-editor/components/style-editor-header";
import { StyleEditorNav } from "@/modules/style-editor/components/style-editor-nav";
import { StyleEditorProvider } from "@/modules/style-editor/context/style-editor-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StyleEditorProvider>
      <div className="[&_[data-slot='label']]:text-fg-muted relative grid grid-cols-[1fr_auto] max-xl:grid-cols-1 [&_[data-slot='label']]:text-sm [&_[data-slot='label']]:font-medium">
        <div className="@container min-w-0 py-4 lg:py-10">
          {/* <DraftStyleSync /> */}
          <StyleEditorHeader />
          <StyleEditorNav className="mt-2">
            {/* {children} */}
            hello world
          </StyleEditorNav>
        </div>
        <div className="sticky top-0 z-20 flex h-[100svh] items-start max-xl:hidden">
          <Preview />
        </div>
      </div>
    </StyleEditorProvider>
  );
}
