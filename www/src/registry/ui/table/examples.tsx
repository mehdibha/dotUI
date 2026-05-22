import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import AsyncLoading from "./demos/async-loading";
import Basic from "./demos/basic";
import ColumnResizing from "./demos/column-resizing";
import Controls from "./demos/controls";
import DisabledRows from "./demos/disabled-rows";
import DisallowEmptySelection from "./demos/disallow-empty-selection";
import DynamicCollection from "./demos/dynamic-collection";
import EmptyState from "./demos/empty-state";
import ExpandableRows from "./demos/expandable-rows";
import Invoices from "./demos/invoices";
import IssueGroups from "./demos/issue-groups";
import LargeListVirtualized from "./demos/large-list-virtualized";
import Links from "./demos/links";
import ProjectBudget from "./demos/project-budget";
import Reordable from "./demos/reordable";
import RowAction from "./demos/row-action";
import Selection from "./demos/selection";
import Sorting from "./demos/sorting";
import StaticRowAction from "./demos/static-row-action";
import Tasks from "./demos/tasks";

export default function TableExamples() {
	return (
		<Examples>
			<Example title="basic">
				<Basic />
			</Example>
			<Example title="invoices">
				<Invoices />
			</Example>
			<Example title="project budget">
				<ProjectBudget />
			</Example>
			<Example title="tasks">
				<Tasks />
			</Example>
			<Example title="large list virtualized">
				<LargeListVirtualized />
			</Example>
			<Example title="async loading">
				<AsyncLoading />
			</Example>
			<Example title="controls">
				<Controls />
			</Example>
			<Example title="dynamic collection">
				<DynamicCollection />
			</Example>
			<Example title="expandable rows">
				<ExpandableRows />
			</Example>
			<Example title="issue groups">
				<IssueGroups />
			</Example>
			<Example title="selection">
				<Selection />
			</Example>
			<Example title="disallow empty selection">
				<DisallowEmptySelection />
			</Example>
			<Example title="column resizing">
				<ColumnResizing />
			</Example>
			<Example title="disabled rows">
				<DisabledRows />
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
			<Example title="sorting">
				<Sorting />
			</Example>
			<Example title="static row action">
				<StaticRowAction />
			</Example>
		</Examples>
	);
}
