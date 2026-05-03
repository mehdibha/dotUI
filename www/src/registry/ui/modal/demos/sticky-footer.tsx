import { Button } from "@/registry/ui/button";
import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogHeading,
} from "@/registry/ui/dialog";
import { Modal } from "@/registry/ui/modal";

const paragraphs = Array.from({ length: 10 }, (_, index) => ({
	id: `paragraph-${index + 1}`,
	text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
}));

export default function Demo() {
	return (
		<Dialog>
			<Button>Sticky Footer</Button>
			<Modal>
				<DialogContent>
					<DialogHeader>
						<DialogHeading>Scrollable Content</DialogHeading>
						<DialogDescription>This is a dialog with scrollable content.</DialogDescription>
					</DialogHeader>
					<DialogBody className="-mx-6 max-h-[60vh] overflow-y-auto px-6">
						{paragraphs.map((paragraph) => (
							<p key={paragraph.id} className="text-sm leading-relaxed">
								{paragraph.text}
							</p>
						))}
					</DialogBody>
					<DialogFooter className="sticky bottom-0 -mx-6 -mb-6 border-t bg-bg px-6 py-4">
						<Button slot="close">Close</Button>
					</DialogFooter>
				</DialogContent>
			</Modal>
		</Dialog>
	);
}
