import { Button } from "@/registry/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/registry/ui/dialog";
import { Popover } from "@/registry/ui/popover";

export default function Demo() {
	return (
		<Dialog>
			<Button>Open popover</Button>
			<Popover>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Dimensions</DialogTitle>
						<DialogDescription>Set the dimensions of the popover.</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Popover>
		</Dialog>
	);
}
