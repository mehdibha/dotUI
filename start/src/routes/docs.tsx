import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { docsSource } from "@/lib/source";

export const Route = createFileRoute("/docs")({
	component: DocsLayout,
});

function DocsLayout() {
	return (
		<div className="[--header-height:calc(var(--spacing)*12)]">
			<Header items={docsSource.pageTree.children} />
			<Outlet />
			<Footer />
		</div>
	);
}
