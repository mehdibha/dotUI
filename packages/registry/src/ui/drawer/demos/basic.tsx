import { Button } from "@dotui/registry/ui/button";
import { Dialog, DialogContent } from "@dotui/registry/ui/dialog";
import { Drawer } from "@dotui/registry/ui/drawer";

export default function Demo() {
	return (
		<Dialog>
			<Button>Open drawer</Button>
			<Drawer>
				<DialogContent>Drawer content</DialogContent>
			</Drawer>
		</Dialog>
	);
}
