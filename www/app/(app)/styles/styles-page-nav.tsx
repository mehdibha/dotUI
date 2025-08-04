"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@dotui/ui/lib/utils";
import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@dotui/ui/registry/components/tabs/motion";

import { useMounted } from "@/hooks/use-mounted";
import { authClient } from "@/modules/auth/lib/client";

const MotionTabList = motion(TabList);

export function StylesPageNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();
  const isMounted = useMounted();

  const items = session?.user
    ? [
        {
          href: `/styles/${session.user.username}`,
          label: "Your styles",
        },
        { href: "/styles", label: "Featured" },
        { href: "/styles/community", label: "Community" },
      ]
    : [
        { href: "/styles", label: "Featured" },
        { href: "/styles/community", label: "Community" },
      ];

  return (
    <Tabs variant="solid" selectedKey={pathname} className="mt-10">
      <TabList
        className={cn(
          "flex-wrap bg-transparent p-0 opacity-0",
          isMounted && !isPending && "animate-in fade-in opacity-100",
        )}
      >
        {items.map((tab) => (
          <Tab
            key={tab.href}
            id={tab.href}
            href={tab.href}
            className={cn(
              "flex h-7 items-center gap-2 rounded-full px-4 text-sm",
            )}
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>
      <TabPanel id={pathname} className="mt-6">
        {children}
      </TabPanel>
    </Tabs>
  );
}
