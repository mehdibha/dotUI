import { GitHubIcon, TwitterIcon } from "@/components/icons";
import { GoogleIcon } from "@/components/icons/google-icon";
import { Button } from "@/registry/ui/default/core/button";
import { TextField } from "@/registry/ui/default/core/text-field";

export default function LoginPage() {
  return (
    <div className="bg-bg-muted w-full max-w-sm rounded-lg border p-8">
      <h1 className="text-2xl font-semibold leading-none tracking-tight">
        Login
      </h1>
      <p className="text-fg-muted mt-2 text-sm">
        Enter your email below to login to your account
      </p>
      <div className="mt-4 flex items-center gap-2">
        <Button
          href="/preview/overview"
          variant="outline"
          className="flex-1"
          aria-label="Sign in with google"
        >
          <GoogleIcon />
        </Button>
        <Button
          href="/preview/overview"
          variant="outline"
          className="flex-1"
          aria-label="Sign in with X"
        >
          <TwitterIcon />
        </Button>
        <Button
          href="/preview/overview"
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
      <TextField label="Email address" className="w-full" />
      <Button
        href="/preview/overview"
        variant="primary"
        className="mt-4 w-full"
      >
        Continue with email
      </Button>
    </div>
  );
}
