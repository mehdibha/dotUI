import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/styles/")({
	component: StylesPage,
});

function StylesPage() {
	return (
		<div className="container py-20">
			<h1 className="font-bold text-2xl">Styles</h1>
			<p className="text-fg-muted">Work in progress.</p>
		</div>
	);
}
