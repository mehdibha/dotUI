"use client";

import { Link } from "@dotui/registry/ui/link";

export function LinkDemo() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-wrap gap-4">
				<Link href="#" variant="accent">
					Accent link
				</Link>
				<Link href="#" variant="quiet">
					Quiet link
				</Link>
				<Link href="#" variant="unstyled">
					Unstyled link
				</Link>
			</div>
			<div className="flex flex-wrap gap-4">
				<Link href="#" variant="accent" isDisabled>
					Disabled link
				</Link>
			</div>
			<div className="max-w-md">
				<p className="text-sm">
					This is a paragraph with an{" "}
					<Link href="#" variant="accent">
						inline link
					</Link>{" "}
					that demonstrates how links work within text. You can also use{" "}
					<Link href="#" variant="quiet">
						quiet links
					</Link>{" "}
					for a more subtle appearance.
				</p>
			</div>
		</div>
	);
}
