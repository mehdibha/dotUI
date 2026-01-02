import { Suspense, useDeferredValue, useId } from "react";
import { useShiki } from "fumadocs-core/highlight/client";
import type { HighlightOptions, HighlightOptionsCommon, HighlightOptionsThemes } from "fumadocs-core/highlight";

import { Pre } from "./code-block";

export interface DynamicPreProps {
	lang: string;
	children: string;
	options?: Omit<HighlightOptionsCommon, "lang"> & HighlightOptionsThemes;
}

export function DynamicPre({ lang, children: code, options }: DynamicPreProps) {
	const id = useId();
	const shikiOptions = {
		lang,
		...options,
		components: {
			pre: Pre,
			...options?.components,
		},
	} satisfies HighlightOptions;

	// Handle null/undefined code
	if (!code) {
		return (
			<Pre>
				<code />
			</Pre>
		);
	}

	return (
		<Suspense fallback={<Placeholder code={code} components={shikiOptions.components} />}>
			<ShikiHighlighter id={id} {...useDeferredValue({ code, options: shikiOptions })} />
		</Suspense>
	);
}

function Placeholder({
	code,
	components = {},
}: {
	code: string;
	components: HighlightOptions["components"];
}) {
	const { pre: PreComponent = "pre", code: Code = "code" } = components as Record<string, React.FC>;

	if (!code) {
		return (
			<PreComponent>
				<Code />
			</PreComponent>
		);
	}

	return (
		<PreComponent>
			<Code>
				{code.split("\n").map((line, i) => (
					<span key={i} className="line">
						{line}
					</span>
				))}
			</Code>
		</PreComponent>
	);
}

function ShikiHighlighter({
	id,
	code,
	options,
}: {
	id: string;
	code: string;
	options: HighlightOptions;
}) {
	return useShiki(code, options, [id, options.lang, code]);
}
