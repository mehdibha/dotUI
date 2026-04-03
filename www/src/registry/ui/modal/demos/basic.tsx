import { Button } from "@/registry/ui/button";
import { Dialog, DialogContent } from "@/registry/ui/dialog";
import { Modal } from "@/registry/ui/modal";

export default function Demo() {
	return (
		<Dialog>
			<Button>Open modal</Button>
			<Modal>
				<DialogContent>modal content</DialogContent>
			</Modal>
		</Dialog>
	);
}
