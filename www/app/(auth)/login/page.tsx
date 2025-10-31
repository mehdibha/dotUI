import { redirect } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@dotui/registry/ui/button";

import { LoginForm } from "@/modules/auth/components/login-form";
import { getSession } from "@/modules/auth/lib/server";

export default async function Page() {
  const session = await getSession();

  if (session?.user) {
    redirect("/");
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
      <LoginForm />
    </div>
  );
}
