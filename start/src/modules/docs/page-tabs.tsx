
import { useSearch } from "@tanstack/react-router";
import { AlignLeftIcon } from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";
import { Tab, TabList, TabPanel, Tabs } from "@dotui/registry/ui/tabs";

import { TOCItems, TOCScrollArea, useTOCItems } from "./toc";

type TabValue = "overview" | "examples";

export function PageTabs({ children }: { children: React.ReactNode }) {
	const search = useSearch({ strict: false }) as { tab?: string };
	const tab: TabValue = search.tab === "examples" ? "examples" : "overview";

	return (
		<Tabs
			data-page-tabs
			selectedKey={tab}
			className="**:data-page-tab-panel:mt-2 **:data-page-tab-panel:sm:mt-4 **:data-page-tab-panel:md:mt-6"
		>
			<TabList className="*:px-4 *:pb-3">
				<Tab id="overview" href={{ to: ".", search: { tab: undefined } }}>
					Overview
				</Tab>
				<Tab id="examples" href={{ to: ".", search: { tab: "examples" } }}>
					Examples
				</Tab>
			</TabList>
			{children}
		</Tabs>
	);
}

interface PageTabPanelProps {
	id: "overview" | "examples";
	children: React.ReactNode;
}

export function PageTabPanel({ id, children }: PageTabPanelProps) {
	const tocItems = useTOCItems();
	const hasToc = tocItems && tocItems.length > 0;

	return (
		<TabPanel
			id={id}
			data-page-tab-panel
			className={cn(id === "overview" && hasToc && "grid grid-cols-1 gap-10 xl:grid-cols-[1fr_180px]")}
		>
			<div className="min-w-0">{children}</div>
			{id === "overview" && hasToc && (
				<div className="sticky top-10 flex h-[calc(100svh-var(--header-height))] flex-col max-xl:hidden">
					<h3 className="inline-flex items-center gap-1.5 text-fg-muted text-sm">
						<AlignLeftIcon className="size-4 text-fg-muted" />
						On this page
					</h3>
					<TOCScrollArea>
						<TOCItems />
					</TOCScrollArea>
				</div>
			)}
		</TabPanel>
	);
}
