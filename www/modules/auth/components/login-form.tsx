"use client";

import React from "react";

import { Button } from "@dotui/ui/components/button";
import {
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogHeading,
  DialogRoot,
} from "@dotui/ui/components/dialog";
import { Overlay } from "@dotui/ui/components/overlay";

import { GitHubIcon } from "@/components/icons";
import { Link } from "@/components/link";
import { authClient } from "../lib/client";

export function LoginForm() {
  const [isPending, setPending] = React.useState(false);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl leading-none font-semibold tracking-tight">
        Log in to dotUI
      </h1>
      <p className="mt-2 text-sm text-fg-muted">
        Enter your email below to login to your account
      </p>
      <Button
        prefix={<GitHubIcon />}
        size="lg"
        className="mt-8 w-full max-w-sm"
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
      <p className="mt-4 text-sm text-fg-muted">
        By continuing, you agree to our{" "}
        <Link href="/terms">Terms of Service</Link> and{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </div>
  );
}
