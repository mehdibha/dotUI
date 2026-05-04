import { PenSquareIcon } from "@/registry/__generated__/icons";
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
import { Input, TextArea } from "@/registry/ui/input";
import { Overlay } from "@/registry/ui/overlay";
import { TextField } from "@/registry/ui/text-field";

export default function Demo() {
	return (
		<Dialog>
			<Button>
				<PenSquareIcon /> Create issue
			</Button>
			<Overlay>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create a new issue</DialogTitle>
						<DialogDescription>Report an issue or create a feature request.</DialogDescription>
					</DialogHeader>
					<DialogBody>
						<TextField aria-label="Title" autoFocus>
							<Input placeholder="Title" className="w-full" />
						</TextField>
						<TextArea aria-label="Description" placeholder="description" className="w-full" />
					</DialogBody>
					<DialogFooter>
						<Button slot="close">Cancel</Button>
						<Button slot="close" variant="primary">
							Save changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</Overlay>
		</Dialog>
	);
}
