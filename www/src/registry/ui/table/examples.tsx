import { Example } from "@/modules/create/preview/example";

import Basic from "./demos/basic";
import ColumnResizing from "./demos/column-resizing";
import Controlled from "./demos/controlled";
import DisabledRows from "./demos/disabled-rows";
import DisallowEmptySelection from "./demos/disallow-empty-selection";
import DynamicCollection from "./demos/dynamic-collection";
import EmptyState from "./demos/empty-state";
import Links from "./demos/links";
import Reordable from "./demos/reordable";
import RowAction from "./demos/row-action";
import Selection from "./demos/selection";
import SelectionBehavior from "./demos/selection-behavior";
import SelectionMode from "./demos/selection-mode";
import Sorting from "./demos/sorting";
import StaticRowAction from "./demos/static-row-action";
import Uncontrolled from "./demos/uncontrolled";

export default function Examples() {
	return (
		<>
			<Example title="basic">
				<Basic />
			</Example>
			<Example title="column resizing">
				<ColumnResizing />
			</Example>
			<Example title="controlled">
				<Controlled />
			</Example>
			<Example title="disabled rows">
				<DisabledRows />
			</Example>
			<Example title="disallow empty selection">
				<DisallowEmptySelection />
			</Example>
			<Example title="dynamic collection">
				<DynamicCollection />
			</Example>
			<Example title="empty state">
				<EmptyState />
			</Example>
			<Example title="links">
				<Links />
			</Example>
			<Example title="reordable">
				<Reordable />
			</Example>
			<Example title="row action">
				<RowAction />
			</Example>
			<Example title="selection">
				<Selection />
			</Example>
			<Example title="selection behavior">
				<SelectionBehavior />
			</Example>
			<Example title="selection mode">
				<SelectionMode />
			</Example>
			<Example title="sorting">
				<Sorting />
			</Example>
			<Example title="static row action">
				<StaticRowAction />
			</Example>
			<Example title="uncontrolled">
				<Uncontrolled />
			</Example>
		</>
	);
}
