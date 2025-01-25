import { ArrowUpIcon } from "lucide-react";
import {
  ResizableTableContainer,
  Table as AriaTable,
  TableHeader as AriaTableHeader,
  Column as AriaColumn,
  Collection as AriaCollection,
  Group as AriaGroup,
  ColumnResizer as AriaColumnResizer,
  Row as AriaRow,
  Cell as AriaCell,
  useTableOptions,
  composeRenderProps,
  type RowProps as AriaRowProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Checkbox } from "@/registry/core/checkbox_basic";
import { focusRing } from "@/registry/lib/focus-styles";
import { Button } from "./button-01";

const tableStyles = tv({
  slots: {
    root: "relative max-h-[280px] w-[550px] scroll-pt-[2.281rem] overflow-auto rounded-lg border dark:border-zinc-600",
    table: "border-separate border-spacing-0",
    header:
      "sticky top-0 z-10 rounded-t-lg border-b bg-gray-100/60 backdrop-blur-md supports-[-moz-appearance:none]:bg-gray-100 dark:border-b-zinc-700 dark:bg-zinc-700/60 dark:supports-[-moz-appearance:none]:bg-zinc-700 forced-colors:bg-[Canvas]",
    columnRoot:
      "cursor-default text-start text-sm font-semibold text-gray-700 dark:text-zinc-300 [&:focus-within]:z-20 [&:hover]:z-20",
    column: "flex h-5 flex-1 items-center gap-1 overflow-hidden px-2",
    resize:
      "resizing:bg-blue-600 forced-colors:resizing:bg-[Highlight] resizing:w-[2px] resizing:pl-[7px] box-content h-5 w-px translate-x-[8px] cursor-col-resize rounded bg-gray-400 bg-clip-content px-[8px] py-1 -outline-offset-2 dark:bg-zinc-500 forced-colors:bg-[ButtonBorder]",
    row: [
      focusRing(),
      "group/row selected:bg-blue-100 selected:hover:bg-blue-200 dark:selected:bg-blue-700/30 dark:selected:hover:bg-blue-700/40 relative cursor-default select-none text-sm text-gray-900 -outline-offset-2 hover:bg-gray-100 disabled:text-gray-300 dark:text-zinc-200 dark:hover:bg-zinc-700/60 dark:disabled:text-zinc-600",
    ],
    cell: [
      focusRing(),
      "group-selected/row:border-[--selected-border] truncate border-b p-2 -outline-offset-2 [--selected-border:theme(colors.blue.200)] group-last/row:border-b-0 dark:border-b-zinc-700 dark:[--selected-border:theme(colors.blue.900)] [:has(+[data-selected])_&]:border-[--selected-border]",
    ],
  },
});

const { root, table, header, columnRoot, column, resize, row, cell } =
  tableStyles();

interface TableProps extends React.ComponentProps<typeof AriaTable> {}
const Table = (props: TableProps) => {
  return (
    <ResizableTableContainer className={root({})}>
      <AriaTable className={table({})} {...props} />
    </ResizableTableContainer>
  );
};

interface TableHeaderProps
  extends React.ComponentProps<typeof AriaTableHeader> {}
const TableHeader = (props: TableHeaderProps) => {
  const { selectionBehavior, selectionMode, allowsDragging } =
    useTableOptions();
  return (
    <AriaTableHeader className={header({})} {...props}>
      {allowsDragging && <AriaColumn />}
      {selectionBehavior === "toggle" && (
        <AriaColumn
          width={36}
          minWidth={36}
          className="cursor-default p-2 text-start text-sm font-semibold"
        >
          {selectionMode === "multiple" && <Checkbox slot="selection" />}
        </AriaColumn>
      )}
      <AriaCollection items={props.columns}>{props.children}</AriaCollection>
    </AriaTableHeader>
  );
};

interface ColumnProps extends React.ComponentProps<typeof AriaColumn> {}
function Column({ children, ...props }: ColumnProps) {
  return (
    <AriaColumn className={columnRoot({})} {...props}>
      {composeRenderProps(
        children,
        (children, { allowsSorting, sortDirection }) => (
          <div className="flex items-center">
            <AriaGroup role="presentation" tabIndex={-1} className={column({})}>
              <span className="truncate">{children}</span>
              {allowsSorting && (
                <span
                  className={`flex h-4 w-4 items-center justify-center transition ${
                    sortDirection === "descending" ? "rotate-180" : ""
                  }`}
                >
                  {sortDirection && (
                    <ArrowUpIcon aria-hidden className="size-4 text-gray-500" />
                  )}
                </span>
              )}
            </AriaGroup>
            {!props.width && <AriaColumnResizer className={resize({})} />}
          </div>
        )
      )}
    </AriaColumn>
  );
}

interface RowProps<T extends object> extends AriaRowProps<T> {}
function Row<T extends object>({
  id,
  columns,
  children,
  ...otherProps
}: RowProps<T>) {
  const { selectionBehavior, allowsDragging } = useTableOptions();

  return (
    <AriaRow id={id} {...otherProps} className={row({})}>
      {allowsDragging && (
        <Cell>
          <Button slot="drag">≡</Button>
        </Cell>
      )}
      {selectionBehavior === "toggle" && (
        <Cell>
          <Checkbox slot="selection" />
        </Cell>
      )}
      <AriaCollection items={columns}>{children}</AriaCollection>
    </AriaRow>
  );
}

interface CellProps extends React.ComponentProps<typeof AriaCell> {}
export function Cell(props: CellProps) {
  return <AriaCell {...props} className={cell()} />;
}
