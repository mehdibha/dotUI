"use client";

import { useDeferredValue, useId } from "react";
import { useShiki } from "fumadocs-core/highlight/client";
import type { HighlightOptions } from "fumadocs-core/highlight";

import { Pre } from "./code-block";

export interface DynamicPreProps {
	lang: string;
	code: string;
}

export function DynamicPre({ lang, code }: DynamicPreProps) {
	const id = useId();
	const deferredCode = useDeferredValue(code);

	return <ShikiHighlighter id={id} lang={lang} code={deferredCode} />;
}

function ShikiHighlighter({ id, lang, code }: { id: string; lang: string; code: string }) {
	const options: HighlightOptions = {
		lang,
		components: {
			pre: Pre,
		},
	};

	return useShiki(code, options, [id, lang, code]);
}
