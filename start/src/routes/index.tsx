import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@dotui/registry/ui/button";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div className="flex min-h-screen items-center justify-center gap-4">
			<Button>Default</Button>
			<Button variant="primary">Primary</Button>
			<Button variant="quiet">Quiet</Button>
		</div>
	);
}
