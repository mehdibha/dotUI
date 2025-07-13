import { PreviewProvider } from "@/components/preview";
import { StylePagesProvider } from "@/modules/styles/providers/style-pages-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PreviewProvider>
      <StylePagesProvider>{children}</StylePagesProvider>
    </PreviewProvider>
  );
}
