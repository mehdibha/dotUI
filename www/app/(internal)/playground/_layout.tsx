import {
  ActiveStylePortalProvider,
  ActiveStyleProvider,
} from "@/modules/styles/active-style-provider";

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ActiveStylePortalProvider>
      <ActiveStyleProvider>{children}</ActiveStyleProvider>
    </ActiveStylePortalProvider>
  );
}
