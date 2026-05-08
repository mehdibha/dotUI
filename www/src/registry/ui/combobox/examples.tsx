import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import Basic from "./demos/basic";
import Disabled from "./demos/disabled";
import DisabledItems from "./demos/disabled-items";
import InDialog from "./demos/in-dialog";
import Invalid from "./demos/invalid";
import IosCityPicker from "./demos/ios-city-picker";
import LargeList from "./demos/large-list";
import Multiple from "./demos/multiple";
import MultipleDisabled from "./demos/multiple-disabled";
import MultipleInvalid from "./demos/multiple-invalid";
import Sections from "./demos/sections";
import Sides from "./demos/sides";
import WithCustomItems from "./demos/with-custom-items";
import WithForm from "./demos/with-form";
import WithGroupsAndSeparator from "./demos/with-groups-and-separator";
import WithIcon from "./demos/with-icon";

export default function ComboboxExamples() {
	return (
		<Examples className="md:grid-cols-2">
			<Example title="Basic">
				<Basic />
			</Example>
			<Example title="Disabled">
				<Disabled />
			</Example>
			<Example title="Invalid">
				<Invalid />
			</Example>
			<Example title="With Groups">
				<Sections />
			</Example>
			<Example title="With Groups and Separator">
				<WithGroupsAndSeparator />
			</Example>
			<Example title="Large List (1000 items)">
				<LargeList />
			</Example>
			<Example title="iOS City Picker" className="md:col-span-2">
				<IosCityPicker />
			</Example>
			<Example title="With Icon Addon">
				<WithIcon />
			</Example>
			<Example title="Form with Combobox">
				<WithForm />
			</Example>
			<Example title="Combobox Multiple">
				<Multiple />
			</Example>
			<Example title="Combobox Multiple Disabled">
				<MultipleDisabled />
			</Example>
			<Example title="Combobox Multiple Invalid">
				<MultipleInvalid />
			</Example>
			<Example title="Items with description">
				<WithCustomItems />
			</Example>
			<Example title="Combobox in Dialog">
				<InDialog />
			</Example>
			<Example title="Disabled Items">
				<DisabledItems />
			</Example>
			<Example title="Sides" className="md:col-span-2">
				<Sides />
			</Example>
		</Examples>
	);
}
