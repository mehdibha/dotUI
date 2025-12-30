import React from "react";

import { GitHubIcon } from "@dotui/registry/components/icons/github";
import { Button } from "@dotui/registry/ui/button";
import { Link } from "@dotui/registry/ui/link";
import { toast } from "@dotui/registry/ui/toast";

import { Logo } from "@/components/layout/logo";
import { authClient } from "@/modules/auth/client";

export function LoginForm({ callbackUrl = "/" }: { callbackUrl?: string }) {
	const [isPending, setPending] = React.useState(false);

	return (
		<div className="flex flex-1 flex-col items-center justify-center p-4">
			<div className="flex flex-col items-center justify-center max-sm:flex-1">
				<Logo type="span" className="flex-col gap-2 [&_svg]:size-12 max-sm:[&_svg]:size-14" />
				<h1 className="mt-6 font-semibold text-3xl leading-none tracking-tight sm:text-3xl">Log in to dotUI</h1>
				<p className="mt-2 text-fg-muted text-sm max-sm:hidden">Sign in with your GitHub account to continue.</p>
			</div>
			<Button
				variant="primary"
				size="lg"
				className="mt-8 w-full sm:max-w-sm"
				isPending={isPending}
				onPress={async () => {
					try {
						setPending(true);
						await authClient.signIn.social({
							provider: "github",
							callbackURL: callbackUrl,
						});
					} catch (error) {
						const message = (error as { message?: string })?.message ?? "Something went wrong while signing in.";
						toast.add({
							title: "Sign in failed",
							description: message,
							variant: "danger",
						});
					} finally {
						setPending(false);
					}
				}}
			>
				<GitHubIcon />
				Continue with GitHub
			</Button>
			<p className="mt-4 text-fg-muted text-sm">
				By continuing, you agree to our <Link href="/terms-of-service">Terms of Service</Link> and{" "}
				<Link href="/privacy-policy">Privacy Policy</Link>.
			</p>
		</div>
	);
}
