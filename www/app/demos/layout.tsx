import { DisableFocusTrap } from "@/components/disable-focus-trap";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center h-screen">
      <DisableFocusTrap />
      {children}
    </div>
  );
}
