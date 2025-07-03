"use client";

import { Button } from "@dotui/ui/components/button";
import { TextField } from "@dotui/ui/components/text-field";
import { GitHubIcon, GoogleIcon, TwitterIcon } from "@dotui/ui/icons";

export function RegisterForm() {
  return (
    <div className="w-full max-w-sm rounded-lg border bg-bg-muted p-8">
      <h1 className="text-2xl leading-none font-semibold tracking-tight">
        Register
      </h1>
      <p className="mt-2 text-sm text-fg-muted">
        Enter your email below to register to your account
      </p>
      <div className="mt-4 flex items-center gap-2">
        <Button
          variant="outline"
          className="flex-1"
          aria-label="Sign up with google"
        >
          <GoogleIcon />
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          aria-label="Sign up with X"
        >
          <TwitterIcon />
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          aria-label="Sign up with github"
        >
          <GitHubIcon />
        </Button>
      </div>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-bg-muted px-2 text-fg-muted">Or</span>
        </div>
      </div>
      <TextField label="Email address" type="email" className="w-full" />
      <Button variant="primary" className="mt-4 w-full" type="submit">
        Continue with email
      </Button>
      <p className="mt-4 text-sm text-fg-muted">
        Already have an account? <span>Login</span>
      </p>
    </div>
  );
}
