import { PreviewProvider } from "@/components/preview";
import { StyleFormProvider } from "@/modules/styles/lib/form-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PreviewProvider>
      <StyleFormProvider>{children}</StyleFormProvider>
    </PreviewProvider>
  );
}
