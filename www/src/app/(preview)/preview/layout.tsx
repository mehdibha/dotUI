import { Loader2Icon } from "lucide-react";
import { ThemeOverride } from "@/components/theme-override";

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeOverride
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2Icon className="animate-spin" />
        </div>
      }
    >
      <div className="min-h-screen">{children}</div>
    </ThemeOverride>
  );
}
