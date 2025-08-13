import { redirect } from "next/navigation";

import { getSession } from "@/modules/auth/lib/server";
import { PageLayout, PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-layout";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <PageLayout>
      {children}
    </PageLayout>
  );
}