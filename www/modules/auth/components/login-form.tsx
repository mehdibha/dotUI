"use client";

import React from "react";

import { Button } from "@dotui/ui/components/button";
import { GitHubIcon } from "@dotui/ui/icons";

import { Link } from "@/components/link";
import { authClient } from "@/modules/auth/lib/client";

export function LoginForm() {
  const [isPending, setPending] = React.useState(false);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-semibold leading-none tracking-tight">
        Log in to dotUI
      </h1>
      <p className="text-fg-muted mt-2 text-sm">
        Sign in with your GitHub account to continue
      </p>
      <Button
        prefix={<GitHubIcon />}
        size="lg"
        className="mt-6 w-full max-w-sm"
        isPending={isPending}
        onPress={async () => {
          try {
            setPending(true);
            await authClient.signIn.social({
              provider: "github",
              callbackURL: "/",
            });
          } catch (error) {
            console.log(error);
          }
        }}
      >
        Continue with GitHub
      </Button>
      <p className="text-fg-muted mt-4 text-sm">
        By continuing, you agree to our{" "}
        <Link href="/terms-of-service">Terms of Service</Link> and{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>
    </div>
  );
}
