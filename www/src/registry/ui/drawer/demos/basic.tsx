import { Button } from "@/registry/ui/button";
import { Dialog, DialogContent } from "@/registry/ui/dialog";
import { Drawer } from "@/registry/ui/drawer";

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
