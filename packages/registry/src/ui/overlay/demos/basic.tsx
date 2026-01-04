import { Button } from "@dotui/registry/ui/button";
import { Dialog, DialogContent } from "@dotui/registry/ui/dialog";
import { Overlay } from "@dotui/registry/ui/overlay";

export default function Demo() {
	return (
		<Dialog>
			<Button>Open overlay</Button>
			<Overlay>
				<DialogContent>some content</DialogContent>
			</Overlay>
		</Dialog>
	);
}
