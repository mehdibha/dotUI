import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";

import { blocksCategories } from "@dotui/registry/blocks/registry";
import { Tab, TabList, Tabs } from "@dotui/registry/ui/tabs";

import { PageHeader, PageHeaderDescription, PageHeaderHeading, PageLayout } from "@/modules/docs/page-layout";

export const Route = createFileRoute("/_app/blocks")({
	component: BlocksLayout,
});

function BlocksLayout() {
	const { category } = useParams({ strict: false });
	return (
		<PageLayout>
			<PageHeader>
				<PageHeaderHeading>Blocks that don't lock you in.</PageHeaderHeading>
				<PageHeaderDescription>Modern UI blocks available in infinite styles.</PageHeaderDescription>
			</PageHeader>
			<Tabs selectedKey={category}>
				<div className="sticky top-0 z-10 flex h-(--header-height) items-end border-b bg-bg pt-1">
					<TabList className="container translate-y-px border-b-0">
						{blocksCategories.map((item) => (
							<Tab
								key={item.slug}
								id={item.slug}
								href={{ to: "/blocks/{-$category}", params: { category: item.path } }}
								className="flex items-center gap-2 rounded-full px-4 py-3 text-sm"
							>
								{item.name}
							</Tab>
						))}
					</TabList>
				</div>
				<Outlet />
			</Tabs>
		</PageLayout>
	);
}
