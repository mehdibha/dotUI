import { Link } from "@/components/ui/link";
import { Button } from "@/components/dynamic-ui/button";
import { TextField } from "@/components/dynamic-ui/text-field";
import { GitHubIcon, TwitterIcon } from "@/components/icons";
import { GoogleIcon } from "@/components/icons";

export default function RegisterPage() {
  return (
    <div className="bg-bg-muted w-full max-w-sm rounded-lg border p-8">
      <h1 className="text-2xl leading-none font-semibold tracking-tight">
        Create an account
      </h1>
      <p className="text-fg-muted mt-2 text-sm">
        Enter your email below to create your account
      </p>
      <div className="mt-4 flex items-center gap-2">
        <Button
          href="/preview/overview"
          variant="outline"
          className="flex-1"
          aria-label="Sign up with google"
        >
          <GoogleIcon />
        </Button>
        <Button
          href="/preview/overview"
          variant="outline"
          className="flex-1"
          aria-label="Sign up with X"
        >
          <TwitterIcon />
        </Button>
        <Button
          href="/preview/overview"
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
          <span className="bg-bg-muted text-fg-muted px-2">Or</span>
        </div>
      </div>
      <TextField label="Email address" className="w-full" />
      <Button
        href="/preview/overview"
        variant="primary"
        className="mt-4 w-full"
      >
        Sign up with email
      </Button>
      <p className="text-fg-muted mt-4 text-sm">
        Already have an account?{" "}
        <Link variant="quiet" href="/preview/login">
          Login
        </Link>
      </p>
    </div>
  );
}
