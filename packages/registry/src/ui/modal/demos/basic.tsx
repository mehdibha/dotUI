import { Button } from "@dotui/registry/ui/button";
import { Dialog, DialogContent } from "@dotui/registry/ui/dialog";
import { Modal } from "@dotui/registry/ui/modal";

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
