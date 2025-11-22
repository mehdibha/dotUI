import { redirect } from "next/navigation";

import { getSafeCallbackUrl } from "@/lib/get-safe-callback-url";
import { LoginForm } from "@/modules/auth/login-form";
import { getSession } from "@/modules/auth/server";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await getSession();
  const { callbackUrl } = await searchParams;

  const safeCallbackUrl = getSafeCallbackUrl(callbackUrl);

  if (session?.user) {
    redirect(safeCallbackUrl as never);
  }

  return (
    <div className="relative flex min-h-svh w-full">
      <LoginForm callbackUrl={safeCallbackUrl} />
    </div>
  );
}
