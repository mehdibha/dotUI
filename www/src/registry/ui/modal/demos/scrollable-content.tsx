import { Button } from "@/registry/ui/button";
import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/registry/ui/dialog";
import { Modal } from "@/registry/ui/modal";

const paragraphs = Array.from({ length: 10 }, (_, index) => ({
	id: `paragraph-${index + 1}`,
	text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
}));

export default function Demo() {
	return (
		<Dialog>
			<Button>Scrollable Content</Button>
			<Modal>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Scrollable Content</DialogTitle>
						<DialogDescription>This is a dialog with scrollable content.</DialogDescription>
					</DialogHeader>
					<DialogBody>
						{paragraphs.map((paragraph) => (
							<p key={paragraph.id} className="text-sm leading-relaxed">
								{paragraph.text}
							</p>
						))}
					</DialogBody>
					<DialogFooter>
						<Button slot="close" type="button">
							Cancel
						</Button>
						<Button type="submit" variant="primary">
							Save changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</Modal>
		</Dialog>
	);
}
