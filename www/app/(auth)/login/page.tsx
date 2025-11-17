import { redirect } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@dotui/registry/ui/button";

import { LoginForm } from "@/modules/auth/components/login-form";
import { getSession } from "@/modules/auth/lib/server";
import { validateCallbackUrl } from "@/modules/auth/lib/utils";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await getSession();
  const { callbackUrl } = await searchParams;

  // Validate and sanitize the callback URL
  const validatedCallbackUrl = validateCallbackUrl(callbackUrl);

  if (session?.user) {
    redirect(validatedCallbackUrl as never);
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
      <LoginForm callbackUrl={validatedCallbackUrl} />
    </div>
  );
}
