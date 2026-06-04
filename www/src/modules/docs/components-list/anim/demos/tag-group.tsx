"use client";

import { useState } from "react";

import type { Key } from "react-aria-components/TagGroup";

import { Label } from "@/registry/ui/field";
import { Tag, TagGroup, TagList } from "@/registry/ui/tag-group";

import { AnimatedPreview } from "../animated-preview";

const initial = new Set<Key>(["news"]);

export default function Demo() {
	const [selected, setSelected] = useState<Set<Key>>(initial);
	return (
		<AnimatedPreview
			reset={() => setSelected(initial)}
			script={async (s) => {
				await s.wait(600);
				await s.click({ selector: ".tag-gaming" }, () => setSelected(new Set(["gaming"])));
				await s.wait(1000);
				await s.click({ selector: ".tag-travel" }, () => setSelected(new Set(["travel"])));
				await s.wait(1100);
				await s.moveOff();
				await s.wait(600);
			}}
		>
			{() => (
				<TagGroup
					selectionMode="single"
					selectedKeys={selected}
					onSelectionChange={(keys) => {
						if (keys !== "all") setSelected(new Set(keys));
					}}
				>
					<Label>Categories</Label>
					<TagList>
						<Tag id="news" className="tag-news">
							News
						</Tag>
						<Tag id="travel" className="tag-travel">
							Travel
						</Tag>
						<Tag id="gaming" className="tag-gaming">
							Gaming
						</Tag>
						<Tag id="shopping" className="tag-shopping">
							Shopping
						</Tag>
					</TagList>
				</TagGroup>
			)}
		</AnimatedPreview>
	);
}
