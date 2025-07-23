"use client";

import { Button } from "@dotui/ui/components/button";
import { TextField } from "@dotui/ui/components/text-field";
import { GitHubIcon, GoogleIcon, TwitterIcon } from "@dotui/ui/icons";

export function LoginForm() {
  return (
    <div className="bg-bg-muted w-full max-w-sm rounded-lg border p-8">
      <h1 className="font-heading text-2xl font-semibold leading-none tracking-tight">
        Login
      </h1>
      <p className="text-fg-muted mt-2 text-sm">
        Enter your email below to login to your account
      </p>
      <div className="mt-4 flex items-center gap-2">
        <Button
          variant="outline"
          className="flex-1"
          aria-label="Sign in with google"
        >
          <GoogleIcon />
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          aria-label="Sign in with X"
        >
          <TwitterIcon />
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          aria-label="Sign in with github"
        >
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
    </div>
  );
}
