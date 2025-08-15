import { redirect } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";

import { LoginForm } from "@/modules/auth/components/login-form";
import { getSession } from "@/modules/auth/lib/server";

export default async function Page() {
  const session = await getSession();

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="absolute left-4 top-4">
        <Button variant="quiet" prefix={<ArrowLeftIcon />} size="sm" href="/">
          Back to home
        </Button>
      </div>
      <LoginForm />
    </div>
  );
}
