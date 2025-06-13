import React from "react";
import { GitHubIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogHeading,
  DialogRoot,
} from "@/components/ui/dialog";
import { Overlay } from "@/components/ui/overlay";

import { authClient } from "../lib/client";

export function SignInModal({ children }: { children: React.ReactNode }) {
  const [isPending, setPending] = React.useState(false);
  return (
    <DialogRoot>
      {children}
      <Overlay modalProps={{ className: "max-w-sm" }}>
        <DialogContent>
          <DialogHeader>
            <DialogHeading className="font-heading text-center text-2xl font-semibold tracking-tighter">
              Sign in to dotUI
            </DialogHeading>
            <DialogDescription className="block text-center">
              Sign in to your account to continue
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <Button
              prefix={<GitHubIcon />}
              size="lg"
              className="w-full"
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
          </DialogBody>
        </DialogContent>
      </Overlay>
    </DialogRoot>
  );
}
