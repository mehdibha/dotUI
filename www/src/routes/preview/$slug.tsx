import { use } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { ExamplesIndex } from "@/registry/__generated__/examples";

const promiseCache = new Map<string, Promise<{ default: React.ComponentType }>>();

function getExamplesPromise(slug: string) {
	let promise = promiseCache.get(slug);
	if (!promise) {
		const load = ExamplesIndex[slug];
		if (!load) return null;
		promise = load();
		promiseCache.set(slug, promise);
	}
	return promise;
}

export const Route = createFileRoute("/preview/$slug")({
	beforeLoad: ({ params }) => {
		getExamplesPromise(params.slug);
	},
	component: PreviewPage,
});

function PreviewPage() {
	const { slug } = Route.useParams();
	const promise = getExamplesPromise(slug);

	if (!promise) {
		return (
			<div className="flex h-screen items-center justify-center">
				<span className="text-fg-muted">Preview not found</span>
			</div>
		);
	}

	const { default: Examples } = use(promise);

	return (
		<div className="mx-auto grid min-h-screen w-full min-w-0 max-w-5xl content-center items-start gap-8 p-4 pt-2 sm:gap-12 sm:p-6 md:grid-cols-2 md:gap-8 lg:grid-cols-1 lg:p-12 2xl:max-w-6xl 2xl:grid-cols-1">
			<Examples />
		</div>
	);
}
