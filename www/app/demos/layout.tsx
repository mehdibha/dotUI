import { DisableFocusTrap } from "@/app/demos/disable-focus-trap";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen items-center justify-center p-4">
      <DisableFocusTrap />
      {children}
    </div>
  );
}
