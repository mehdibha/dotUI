"use client";

import React from "react";

import { Button } from "@dotui/ui/components/button";
import { toast } from "@dotui/ui/components/toast";
import { GitHubIcon } from "@dotui/ui/icons";

import { Link } from "@dotui/ui/components/link";
import { Logo } from "@/components/logo";
import { authClient } from "@/modules/auth/lib/client";

export function LoginForm() {
  const [isPending, setPending] = React.useState(false);

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center max-sm:flex-1">
        <Logo
          extanded={false}
          className="flex-col gap-2 [&_svg]:size-12 max-sm:[&_svg]:size-14"
        />
        <h1 className="mt-6 text-3xl font-semibold leading-none tracking-tight sm:text-3xl">
          Log in to dotUI
        </h1>
        <p className="text-fg-muted mt-2 text-sm max-sm:hidden">
          Sign in with your GitHub account to continue.
        </p>
      </div>
      <Button
        variant="primary"
        prefix={<GitHubIcon />}
        size="lg"
        className="mt-8 w-full sm:max-w-sm"
        isPending={isPending}
        onPress={async () => {
          try {
            setPending(true);
            await authClient.signIn.social({
              provider: "github",
              callbackURL: "/",
            });
          } catch (error) {
            const message =
              (error as { message?: string })?.message ??
              "Something went wrong while signing in.";
            toast.add({
              title: "Sign in failed",
              description: message,
              variant: "danger",
            });
          } finally {
            setPending(false);
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
