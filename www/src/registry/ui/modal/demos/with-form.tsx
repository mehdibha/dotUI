"use client";

import { Button } from "@/registry/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogHeading,
} from "@/registry/ui/dialog";
import { Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { Modal } from "@/registry/ui/modal";
import { TextField } from "@/registry/ui/text-field";

export default function Demo() {
	return (
		<Dialog>
			<Button>Edit Profile</Button>
			<Modal>
				<form onSubmit={(event) => event.preventDefault()}>
					<DialogContent>
						<DialogHeader>
							<DialogHeading>Edit profile</DialogHeading>
							<DialogDescription>
								Make changes to your profile here. Click save when you&apos;re done.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4">
							<TextField defaultValue="Pedro Duarte" autoFocus>
								<Label>Name</Label>
								<Input name="name" />
							</TextField>
							<TextField defaultValue="@peduarte">
								<Label>Username</Label>
								<Input name="username" />
							</TextField>
						</div>
						<DialogFooter>
							<Button slot="close" type="button">
								Cancel
							</Button>
							<Button type="submit" variant="primary">
								Save changes
							</Button>
						</DialogFooter>
					</DialogContent>
				</form>
			</Modal>
		</Dialog>
	);
}
