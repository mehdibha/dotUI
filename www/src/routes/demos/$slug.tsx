import { Suspense } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { DemosIndex } from "@/registry/__generated__/demos";

export const Route = createFileRoute("/demos/$slug")({
	component: DemoPage,
});

function getDemosForComponent(slug: string) {
	const prefix = `${slug}/demos/`;
	return Object.entries(DemosIndex)
		.filter(([key]) => key.startsWith(prefix))
		.map(([key, entry]) => ({
			name: key.replace(prefix, ""),
			component: entry.component,
		}));
}

function DemoPage() {
	const { slug } = Route.useParams();
	const demos = getDemosForComponent(slug);

	if (demos.length === 0) {
		return (
			<div className="flex h-screen items-center justify-center">
				<span className="text-fg-muted">Demo not found</span>
			</div>
		);
	}

	return (
		<div className="mx-auto grid min-h-screen w-full min-w-0 max-w-5xl content-center items-start gap-8 p-4 pt-2 sm:gap-12 sm:p-6 md:grid-cols-2 md:gap-8 lg:grid-cols-1 lg:p-12 2xl:max-w-6xl 2xl:grid-cols-1">
			{demos.map((demo) => {
				const Component = demo.component;
				return (
					<div
						key={demo.name}
						className="mx-auto flex w-full min-w-0 max-w-lg flex-col gap-1 self-stretch lg:max-w-none"
					>
						<h3 className="px-1.5 py-2 font-medium text-fg-muted text-xs">{demo.name.replace(/-/g, " ")}</h3>
						<div className="flex min-w-0 flex-1 flex-col items-start gap-6 rounded-xl bg-card p-12 text-fg *:[div:not([class*='w-'])]:w-full">
							<Suspense fallback={null}>
								<Component />
							</Suspense>
						</div>
					</div>
				);
			})}
		</div>
	);
}
