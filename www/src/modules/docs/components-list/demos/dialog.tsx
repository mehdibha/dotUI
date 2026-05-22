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
import { Overlay } from "@/registry/ui/overlay";

export function DialogDemo() {
	return (
		<Dialog>
			<Button>Open Dialog</Button>
			<Overlay>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Dialog Title</DialogTitle>
						<DialogDescription>This is a dialog description.</DialogDescription>
					</DialogHeader>
					<DialogBody>
						<p>Dialog content goes here.</p>
					</DialogBody>
					<DialogFooter>
						<Button slot="close">Cancel</Button>
						<Button slot="close" variant="primary">
							Confirm
						</Button>
					</DialogFooter>
				</DialogContent>
			</Overlay>
		</Dialog>
	);
}
