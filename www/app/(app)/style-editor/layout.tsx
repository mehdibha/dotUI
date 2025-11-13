import { Preview } from "@/modules/style-editor/components/preview";
import { StyleEditorHeader } from "@/modules/style-editor/components/style-editor-header";
import { StyleEditorNav } from "@/modules/style-editor/components/style-editor-nav";
import {
  StyleEditorForm,
  StyleEditorProvider,
} from "@/modules/style-editor/context/style-editor-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StyleEditorProvider>
      <div className="relative grid grid-cols-[1fr_auto] **:data-[slot='label']:font-medium **:data-[slot='label']:text-fg-muted **:data-[slot='label']:text-sm max-xl:grid-cols-1">
        <div className="@container min-w-0 py-8">
          <StyleEditorForm>
            <StyleEditorHeader />
            <StyleEditorNav className="mt-2">{children}</StyleEditorNav>
          </StyleEditorForm>
        </div>
        <div className="sticky top-0 z-20 flex h-svh items-start max-xl:hidden">
          <Preview />
        </div>
      </div>
    </StyleEditorProvider>
  );
}
