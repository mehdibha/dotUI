import { Button } from "@/registry/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/registry/ui/dialog";
import { Modal } from "@/registry/ui/modal";

export default function Demo() {
	return (
		<Dialog>
			<Button>No Close Button</Button>
			<Modal>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>No Close Button</DialogTitle>
						<DialogDescription>This dialog doesn&apos;t have a close button in the top-right corner.</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button slot="close">Close</Button>
					</DialogFooter>
				</DialogContent>
			</Modal>
		</Dialog>
	);
}
