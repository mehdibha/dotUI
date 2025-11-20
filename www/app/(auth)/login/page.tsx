import { redirect } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@dotui/registry/ui/button";

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
      <div className="absolute top-4 left-4">
        <Button variant="quiet" size="sm" asChild>
          <a href="/">
            <ArrowLeftIcon />
            Back to home
          </a>
        </Button>
      </div>
      <LoginForm callbackUrl={safeCallbackUrl} />
    </div>
  );
}
