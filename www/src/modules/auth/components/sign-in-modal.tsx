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
  return (
    <DialogRoot>
      {children}
      <Overlay modalProps={{ className: "max-w-sm" }}>
        <DialogContent>
          {({ close }) => (
            <>
              <DialogHeader>
                <DialogHeading className="font-heading text-center text-2xl font-semibold tracking-tighter">
                  Sign in to dotUI
                </DialogHeading>
                <DialogDescription className="block text-center">
                  Sign in to your account to continue
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                {/* <Button size="lg" prefix={<GoogleIcon />} className="w-full">
                  Continue with Google
                </Button> */}
                <Button
                  prefix={<GitHubIcon />}
                  size="lg"
                  className="w-full"
                  onPress={async () => {
                    await authClient.signIn.social({
                      provider: "github",
                    });
                    close();
                  }}
                >
                  Continue with GitHub
                </Button>
              </DialogBody>
            </>
          )}
        </DialogContent>
      </Overlay>
    </DialogRoot>
  );
}
