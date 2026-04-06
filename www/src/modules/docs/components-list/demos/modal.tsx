import { Button } from "@/registry/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogHeading } from "@/registry/ui/dialog";
import { Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { Modal } from "@/registry/ui/modal";
import { TextField } from "@/registry/ui/text-field";

export function ModalDemo() {
	return (
		<div className="flex h-60 items-end justify-center">
			<Dialog>
				<Button>Open Modal</Button>
				<Modal>
					<DialogContent>
						<DialogHeader>
							<DialogHeading>Edit username</DialogHeading>
						</DialogHeader>
						<DialogBody>
							<TextField defaultValue="@mehdibha" className="w-full">
								<Label>Username</Label>
								<Input />
							</TextField>
						</DialogBody>
						<DialogFooter className="flex-row! justify-end">
							<Button slot="close">Cancel</Button>
							<Button slot="close" variant="primary">
								Apply
							</Button>
						</DialogFooter>
					</DialogContent>
				</Modal>
			</Dialog>
		</div>
	);
}
