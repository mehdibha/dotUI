"use client";

import { usePathname } from "next/navigation";

import { cn } from "@dotui/registry/lib/utils";
import { Tab, TabList, TabPanel, Tabs } from "@dotui/registry/ui/tabs/motion";

import { useMounted } from "@/hooks/use-mounted";
import { authClient } from "@/modules/auth/lib/client";

export function StylesPageNav({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();
  const isMounted = useMounted();

  const items = session?.user
    ? ([
        {
          href: `/styles/my-styles`,
          label: "Your styles",
        },
        { href: "/styles", label: "Featured" },
        { href: "/styles/community", label: "Community" },
      ] as const)
    : ([
        { href: "/styles", label: "Featured" },
        { href: "/styles/community", label: "Community" },
      ] as const);

  return (
    <Tabs
      variant="underline"
      selectedKey={pathname}
      className={cn("", className)}
    >
      <div className="sticky top-0 z-40 border-b bg-bg">
        <TabList className={cn("container w-full overflow-x-auto border-b-0")}>
          {items.map((tab) => (
            <Tab
              key={tab.href}
              id={tab.href}
              href={tab.href}
              className={cn(
                "flex h-7 items-center gap-2 px-4 pt-6 pb-5 text-sm opacity-0",
                isMounted &&
                  !isPending &&
                  "animate-in opacity-100 fade-in slide-in-from-bottom-1",
              )}
            >
              {tab.label}
            </Tab>
          ))}
        </TabList>
      </div>
      <TabPanel id={pathname} className="container mt-6">
        {children}
      </TabPanel>
    </Tabs>
  );
}
