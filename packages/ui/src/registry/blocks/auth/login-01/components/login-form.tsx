"use client";

import { RiUserLine } from "@remixicon/react";

import { Button } from "@dotui/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@dotui/ui/components/card";
import { TextField } from "@dotui/ui/components/text-field";
import { GitHubIcon, GoogleIcon, TwitterIcon } from "@dotui/ui/icons";
import { cn } from "@dotui/ui/lib/utils";

export function LoginForm(props: React.ComponentProps<"div">) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="text-xl">Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-4 flex items-center gap-2 [&_button]:flex-1">
          <Button aria-label="Sign in with google">
            <GoogleIcon />
          </Button>
          <Button aria-label="Sign in with X">
            <TwitterIcon />
          </Button>
          <Button aria-label="Sign in with github">
            <GitHubIcon />
          </Button>
        </div>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-bg-muted text-fg-muted px-2">Or</span>
          </div>
        </div>
        <TextField label="Email address" type="email" className="w-full" />
        <Button variant="primary" className="mt-4 w-full" type="submit">
          Continue with email
        </Button>
        <p className="text-fg-muted mt-4 text-sm">
          Don&apos;t have an account? <span>Register</span>
        </p>
      </CardContent>
    </Card>
  );
}
