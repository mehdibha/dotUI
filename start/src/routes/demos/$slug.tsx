import { createFileRoute } from "@tanstack/react-router";
import { componentDemos } from "@/modules/docs/components-list/demos";

export const Route = createFileRoute("/demos/$slug")({
	component: DemoPage,
});

function DemoPage() {
	const { slug } = Route.useParams();
	const Demo = componentDemos[slug];

	if (!Demo) {
		return (
			<div className="flex h-screen items-center justify-center">
				<span className="text-fg-muted">Demo not found</span>
			</div>
		);
	}

	return (
		<div className="flex h-screen w-full items-center justify-center bg-bg p-4">
			<Demo />
		</div>
	);
}
