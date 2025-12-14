import { ExternalLinkIcon, Globe2Icon, LockIcon } from "lucide-react";

import { Button } from "@dotui/registry/ui/button";
import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogHeading,
} from "@dotui/registry/ui/dialog";
import { Label } from "@dotui/registry/ui/field";
import { Input, TextArea } from "@dotui/registry/ui/input";
import { Modal } from "@dotui/registry/ui/modal";
import { Select, SelectItem } from "@dotui/registry/ui/select";
import { TextField } from "@dotui/registry/ui/text-field";

export function PublishStyleModal({ children }: { children: React.ReactNode }) {
	return (
		<Dialog>
			{children}
			<Modal>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogHeading>Publish your style</DialogHeading>
						<DialogDescription>Follow these steps to correctly publish your style.</DialogDescription>
					</DialogHeader>
					<DialogBody className="-mx-6 space-y-2 px-6 pt-1 [&_[data-slot='label']]:text-sm">
						<TextField defaultValue="Minimalist" className="w-full">
							<Label>Name</Label>
							<Input />
						</TextField>
						<TextField defaultValue="minimalist" className="w-full">
							<Label>slug</Label>
							<Input />
						</TextField>
						<Select aria-label="Visibility" defaultSelectedKey="public" className="w-full">
							<SelectItem id="public">
								<Globe2Icon />
								Public
							</SelectItem>
							<SelectItem id="unlisted">
								<ExternalLinkIcon />
								Unlisted
							</SelectItem>
							<SelectItem id="private" isDisabled>
								<LockIcon />
								Private
							</SelectItem>
						</Select>
						<TextField className="w-full">
							<Label>Description (optional)</Label>
							<TextArea />
						</TextField>
					</DialogBody>
					<DialogFooter>
						<Button slot="close">Cancel</Button>
						<Button variant="primary" slot="close">
							Publish
						</Button>
					</DialogFooter>
				</DialogContent>
			</Modal>
		</Dialog>
	);
}
