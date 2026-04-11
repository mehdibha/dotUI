import { use, useCallback, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { DesignSystemProvider } from "@/modules/core/styles";
import { DEFAULTS, useIframeMessageListener } from "@/modules/create/preset";
import type { DesignSystem } from "@/modules/create/preset";
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
	const [designSystem, setDesignSystem] = useState<DesignSystem>(DEFAULTS);

	useIframeMessageListener(
		useCallback((ds: DesignSystem) => setDesignSystem(ds), []),
	);

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
		<DesignSystemProvider
			styles={designSystem.componentStyles}
			params={designSystem.componentParams}
		>
			<Examples />
		</DesignSystemProvider>
	);
}
