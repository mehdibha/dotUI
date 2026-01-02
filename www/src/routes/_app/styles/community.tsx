import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/styles/community")({
	component: CommunityStylesPage,
});

function CommunityStylesPage() {
	return (
		<div className="container py-20">
			<h1 className="text-2xl font-bold">Community Styles</h1>
			<p className="text-fg-muted">Work in progress.</p>
		</div>
	);
}
