import type { Metadata } from "next";

import { EffectsEditor } from "@/modules/style-editor/effects-editor";

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<{ username: string; stylename: string }>;
}): Promise<Metadata> {
	const { stylename } = await searchParams;
	return {
		title: `${stylename} style`,
	};
}

export default function EffectsPage() {
	return <EffectsEditor />;
}
