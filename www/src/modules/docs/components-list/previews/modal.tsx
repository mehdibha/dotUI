"use client";

import { Button } from "@/registry/ui/button";
import { DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/registry/ui/dialog";
import { Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { useStyles as useModalStyles } from "@/registry/ui/modal/styles";
import { TextField } from "@/registry/ui/text-field";

import { InertPreview } from "./inert-preview";

/** Static "open" Modal preview — backdrop + centered panel, no overlay wrapper. */
export function ModalPreview() {
	const { backdrop, viewport, modal } = useModalStyles()();
	return (
		<InertPreview>
			<div className={backdrop({ className: "opacity-100" })} />
			<div data-slot="modal-viewport" className={viewport()}>
				{/* data-modal="" applies the dialog's `in-data-modal:` density styles.
				    w-[86%] keeps the dimmed backdrop visible around the panel. */}
				<div data-modal="" className={modal({ className: "w-[86%]" })}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Edit username</DialogTitle>
						</DialogHeader>
						<DialogBody>
							<TextField defaultValue="@mehdibha" className="w-full">
								<Label>Username</Label>
								<Input />
							</TextField>
						</DialogBody>
						<DialogFooter className="flex-row! justify-end">
							<Button size="sm">Cancel</Button>
							<Button size="sm" variant="primary">
								Apply
							</Button>
						</DialogFooter>
					</DialogContent>
				</div>
			</div>
		</InertPreview>
	);
}
