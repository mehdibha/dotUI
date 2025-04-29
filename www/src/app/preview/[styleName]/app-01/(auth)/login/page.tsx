"use client";

import { useRouter } from "next/navigation";
import { Form } from "react-aria-components";
import { Link } from "@/components/ui/link";
import { Button } from "@/components/dynamic-ui/button";
import { TextField } from "@/components/dynamic-ui/text-field";
import { GitHubIcon, TwitterIcon } from "@/components/icons";
import { GoogleIcon } from "@/components/icons";
import { useSimulateApiCall } from "@/app/preview/[styleName]/app-01/hooks/use-api";

export default function LoginPage() {
  const router = useRouter();
  const loginWithEmail = useSimulateApiCall({
    onSuccess: () => router.push("/preview/app/overview"),
  });
  const loginWithGoogle = useSimulateApiCall({
    onSuccess: () => router.push("/preview/app/overview"),
  });
  const loginWithX = useSimulateApiCall({
    onSuccess: () => router.push("/preview/app/overview"),
  });
  const loginWithGithub = useSimulateApiCall({
    onSuccess: () => router.push("/preview/app/overview"),
  });

  return (
    <div className="bg-bg-muted w-full max-w-sm rounded-lg border p-8">
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          loginWithEmail.simulateApiCall();
        }}
      >
        <h1 className="text-2xl font-semibold leading-none tracking-tight">
          Login
        </h1>
        <p className="text-fg-muted mt-2 text-sm">
          Enter your email below to login to your account
        </p>
        <div className="mt-4 flex items-center gap-2">
          <Button
            isPending={loginWithGoogle.status === "loading"}
            onPress={loginWithGoogle.simulateApiCall}
            variant="outline"
            className="flex-1"
            aria-label="Sign in with google"
          >
            <GoogleIcon />
          </Button>
          <Button
            isPending={loginWithX.status === "loading"}
            onPress={loginWithX.simulateApiCall}
            variant="outline"
            className="flex-1"
            aria-label="Sign in with X"
          >
            <TwitterIcon />
          </Button>
          <Button
            isPending={loginWithGithub.status === "loading"}
            onPress={loginWithGithub.simulateApiCall}
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
        <Button
          isPending={loginWithEmail.status === "loading"}
          variant="primary"
          className="mt-4 w-full"
          type="submit"
        >
          Continue with email
        </Button>
        <p className="text-fg-muted mt-4 text-sm">
          Don&apos;t have an account?{" "}
          <Link variant="quiet" href="/preview/register">
            Register
          </Link>
        </p>
      </Form>
    </div>
  );
}
