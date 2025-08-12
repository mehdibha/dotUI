import { StyleEditorProvider } from "@/modules/styles/providers/style-editor-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <StyleEditorProvider>{children}</StyleEditorProvider>;
}
