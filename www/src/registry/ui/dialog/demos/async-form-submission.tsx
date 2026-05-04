"use client";

import React from "react";
import * as FormPrimitives from "react-aria-components/Form";

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
import { Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { Overlay } from "@/registry/ui/overlay";
import { TextField } from "@/registry/ui/text-field";

export default function Demo() {
	const [isPending, setIsPending] = React.useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsPending(true);
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setIsPending(false);
	};

	return (
		<Dialog>
			<Button>Edit username</Button>
			<Overlay>
				<DialogContent>
					{({ close }) => (
						<>
							<DialogHeader>
								<DialogTitle>Edit username</DialogTitle>
								<DialogDescription>Make changes to your profile.</DialogDescription>
							</DialogHeader>
							<DialogBody>
								<FormPrimitives.Form
									onSubmit={(e) => {
										handleSubmit(e);
										close();
									}}
								>
									<TextField autoFocus defaultValue="@mehdibha" isRequired>
										<Label>Username</Label>
										<Input className="w-full" />
									</TextField>
								</FormPrimitives.Form>
							</DialogBody>
							<DialogFooter>
								<Button variant="default" slot="close">
									Cancel
								</Button>
								<Button type="submit" isPending={isPending} variant="primary">
									Save changes
								</Button>
							</DialogFooter>
						</>
					)}
				</DialogContent>
			</Overlay>
		</Dialog>
	);
}
