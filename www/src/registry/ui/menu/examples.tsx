import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Account from "./demos/account";
import CheckboxesWithIcons from "./demos/checkboxes-with-icons";
import Complex from "./demos/complex";
import InDialog from "./demos/in-dialog";
import RadioWithIcons from "./demos/radio-with-icons";
import Sides from "./demos/sides";
import WithAvatar from "./demos/with-avatar";
import WithCheckboxes from "./demos/with-checkboxes";
import WithDestructive from "./demos/with-destructive";
import WithIcons from "./demos/with-icons";
import WithRadio from "./demos/with-radio";
import WithShortcuts from "./demos/with-shortcuts";
import WithSubmenu from "./demos/with-submenu";

export default function MenuExamples() {
	return (
		<Examples>
			<Example title="Basic">
				<Account />
			</Example>
			<Example title="Complex">
				<Complex />
			</Example>
			<Example title="Sides" className="lg:col-span-2">
				<Sides />
			</Example>
			<Example title="With Icons">
				<WithIcons />
			</Example>
			<Example title="With Shortcuts">
				<WithShortcuts />
			</Example>
			<Example title="With Submenu">
				<WithSubmenu />
			</Example>
			<Example title="With Checkboxes">
				<WithCheckboxes />
			</Example>
			<Example title="Checkboxes with Icons">
				<CheckboxesWithIcons />
			</Example>
			<Example title="With Radio Group">
				<WithRadio />
			</Example>
			<Example title="Radio with Icons">
				<RadioWithIcons />
			</Example>
			<Example title="With Destructive Items">
				<WithDestructive />
			</Example>
			<Example title="With Avatar">
				<WithAvatar />
			</Example>
			<Example title="In Dialog">
				<InDialog />
			</Example>
		</Examples>
	);
}
