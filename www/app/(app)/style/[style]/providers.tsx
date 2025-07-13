import { StylePagesProvider } from "@/modules/styles/providers/style-pages-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <StylePagesProvider>{children}</StylePagesProvider>;
}
