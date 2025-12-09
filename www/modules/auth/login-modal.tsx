"use client";

import React from "react";
import { usePathname } from "next/navigation";

import { GitHubIcon } from "@dotui/registry/components/icons/github";
import { Button } from "@dotui/registry/ui/button";
import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogHeading,
} from "@dotui/registry/ui/dialog";
import { Link } from "@dotui/registry/ui/link";
import { Modal } from "@dotui/registry/ui/modal";
import { toast } from "@dotui/registry/ui/toast";

import { authClient } from "./client";

export function LoginModal({ children }: { children: React.ReactNode }) {
	const [isPending, setPending] = React.useState(false);
	const pathname = usePathname();

	return (
		<Dialog>
			{children}
			<Modal>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogHeading>Sign in</DialogHeading>
						<DialogDescription>Sign in with your GitHub account to continue</DialogDescription>
					</DialogHeader>
					<DialogBody>
						<Button
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
					</DialogBody>
				</DialogContent>
			</Modal>
		</Dialog>
	);
}
