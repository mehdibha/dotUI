"use client";

import { useState } from "react";

import { CopyIcon, PencilIcon, ShareIcon, StarIcon } from "lucide-react";

import type { Key } from "react-aria-components/ListBox";

import { ListBox, ListBoxItem } from "@/registry/ui/list-box";

import { AnimatedPreview } from "../animated-preview";

const initial = new Set<Key>(["edit"]);

export default function Demo() {
	const [selected, setSelected] = useState<Set<Key>>(initial);
	return (
		<AnimatedPreview
			reset={() => setSelected(initial)}
			script={async (s) => {
				await s.wait(600);
				await s.click({ selector: ".li-share" }, () => setSelected(new Set(["share"])));
				await s.wait(1100);
				await s.click({ selector: ".li-favorite" }, () => setSelected(new Set(["favorite"])));
				await s.wait(1200);
				await s.moveOff();
				await s.wait(600);
			}}
		>
			{() => (
				<div className="w-52 rounded-md border bg-card shadow-sm">
					<ListBox
						aria-label="Actions"
						selectionMode="single"
						selectedKeys={selected}
						onSelectionChange={(keys) => {
							if (keys !== "all") setSelected(new Set(keys));
						}}
					>
						<ListBoxItem id="edit" className="li-edit">
							<PencilIcon />
							Edit
						</ListBoxItem>
						<ListBoxItem id="copy" className="li-copy">
							<CopyIcon />
							Copy link
						</ListBoxItem>
						<ListBoxItem id="share" className="li-share">
							<ShareIcon />
							Share
						</ListBoxItem>
						<ListBoxItem id="favorite" className="li-favorite">
							<StarIcon />
							Add to favorites
						</ListBoxItem>
					</ListBox>
				</div>
			)}
		</AnimatedPreview>
	);
}
