import type { Metadata } from "next";

import {
	PageActions,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
	PageLayout,
} from "@/components/layout/page-layout";
import { BlocksNav } from "@/modules/blocks/blocks-nav";
import { ActiveStyleSelector } from "@/modules/styles/active-style-selector";

const title = "Blocks that don't lock you in.";
const description = "Modern UI blocks available in infinite styles.";

export const metadata: Metadata = {
	title,
	description,
	openGraph: {
		images: [
			{
				url: `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
			},
		],
	},
	twitter: {
		images: [
			{
				url: `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
			},
		],
	},
};

export default function BlocksLayout({ children }: LayoutProps<"/blocks">) {
	return (
		<PageLayout>
			<PageHeader>
				<PageHeaderHeading>{title}</PageHeaderHeading>
				<PageHeaderDescription>{description}</PageHeaderDescription>
				<PageActions>
					<ActiveStyleSelector buttonProps={{ className: "px-4" }} />
				</PageActions>
			</PageHeader>
			<BlocksNav>{children}</BlocksNav>
		</PageLayout>
	);
}
