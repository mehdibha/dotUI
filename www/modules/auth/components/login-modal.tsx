"use client";

import React from "react";

import { Button } from "@dotui/ui/components/button";
import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogHeader,
  DialogHeading,
  DialogRoot,
} from "@dotui/ui/components/dialog";
import { GitHubIcon } from "@dotui/ui/icons";

import { Link } from "@/components/link";
import { authClient } from "../lib/client";
import { usePathname } from "next/navigation";

export function LoginModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPending, setPending] = React.useState(false);
  const pathname = usePathname();

  return (
    <DialogRoot>
      {children}
      <Dialog modalProps={{ className: "max-w-md" }}>
        <DialogHeader>
          <DialogHeading>Sign in</DialogHeading>
          <DialogDescription>
            Sign in with your GitHub account to continue
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Button
            prefix={<GitHubIcon />}
            size="lg"
            className="w-full max-w-sm"
            isPending={isPending}
            onPress={async () => {
              try {
                setPending(true);
                await authClient.signIn.social({
                  provider: "github",
                  callbackURL: pathname,
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
        </DialogBody>
      </Dialog>
    </DialogRoot>
  );
}
