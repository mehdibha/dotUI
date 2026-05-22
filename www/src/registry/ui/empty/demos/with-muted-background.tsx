import { ArrowUpRightIcon } from "@/registry/__generated__/icons";
import { Button, LinkButton } from "@/registry/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/registry/ui/empty";

export default function Demo() {
	return (
		<Empty className="bg-muted">
			<EmptyHeader>
				<EmptyTitle>No results found</EmptyTitle>
				<EmptyDescription>No results found for your search. Try adjusting your search terms.</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button variant="primary">Try again</Button>
				<LinkButton variant="link" href="#" className="text-fg-muted">
					Learn more <ArrowUpRightIcon />
				</LinkButton>
			</EmptyContent>
		</Empty>
	);
}
