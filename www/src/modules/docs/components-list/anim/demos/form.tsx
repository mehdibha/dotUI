"use client";

import { useState } from "react";

import * as FormPrimitives from "react-aria-components/Form";

import { Button } from "@/registry/ui/button";
import { Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [value, setValue] = useState("");
	const [pressed, setPressed] = useState(false);
	return (
		<AnimatedPreview
			reset={() => {
				setValue("");
				setPressed(false);
			}}
			script={async (s) => {
				await s.wait(500);
				await s.type("field", "Ada", setValue, { perChar: 130 });
				await s.wait(600);
				await s.click("submit", () => {
					setPressed(true);
					setTimeout(() => setPressed(false), 170);
				});
				await s.wait(1300);
				await s.moveOff();
				await s.wait(700);
			}}
		>
			{(ref) => (
				<FormPrimitives.Form
					className="w-52 space-y-3"
					onSubmit={(e) => {
						e.preventDefault();
					}}
				>
					<div ref={ref("field")}>
						<TextField value={value} onChange={setValue}>
							<Label>Name</Label>
							<Input placeholder="Name" />
						</TextField>
					</div>
					<span ref={ref("submit")} className="inline-block transition-transform" style={{ scale: pressed ? 0.94 : 1 }}>
						<Button variant="primary" type="submit">
							Submit
						</Button>
					</span>
				</FormPrimitives.Form>
			)}
		</AnimatedPreview>
	);
}
