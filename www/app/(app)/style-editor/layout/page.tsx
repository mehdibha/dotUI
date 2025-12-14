import type { Metadata } from "next";

import { LayoutEditor } from "@/modules/style-editor/layout-editor";

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

export default function LayoutPage() {
	return <LayoutEditor />;
}
