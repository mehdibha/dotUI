import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/styles/")({
	component: StylesPage,
	headers: () => ({
		"Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
	}),
});

function StylesPage() {
	return (
		<div className="container py-20">
			<h1 className="font-bold text-2xl">Styles</h1>
			<p className="text-fg-muted">Work in progress.</p>
		</div>
	);
}
