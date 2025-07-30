"use client";

import { PageNav } from "@/components/page-nav";
import { useMounted } from "@/hooks/use-mounted";
import { authClient } from "@/modules/auth/lib/client";

export function StylesPageNav({ children }: { children: React.ReactNode }) {
  const session = authClient.useSession();
  const isMounted = useMounted();

  console.log(session);

  const items = session?.data?.user
    ? [
        {
          href: `/styles/${session.data.user.username}`,
          label: "Your styles",
        },
        { href: "/styles", label: "Featured" },
        { href: "/styles/community", label: "Community" },
      ]
    : [
        // { href: "/styles", label: "Featured" },
        // { href: "/community", label: "Community" },
      ];

  return (
    <PageNav items={session?.isPending && !isMounted ? [] : items} fade>
      {children}
    </PageNav>
  );
}
