import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";
import BadgeDemo from "@/registry/ui/badge/demos/default";
import { Kbd } from "@/registry/ui/kbd";
import TagGroupDemo from "@/registry/ui/tag-group/demos/basic";

export default function TagsGroupExamples() {
	return (
		<Examples>
			<Example title="Badge">
				<BadgeDemo />
			</Example>
			<Example title="Tag Group">
				<TagGroupDemo />
			</Example>
			<Example title="Kbd">
				<div className="flex items-center gap-2">
					<Kbd>⌘</Kbd>
					<Kbd>K</Kbd>
				</div>
			</Example>
		</Examples>
	);
}
