import {
  ArrowRightIcon,
  BoldIcon,
  ChevronDownIcon,
  DownloadIcon,
  ItalicIcon,
  MoreHorizontalIcon,
  PinIcon,
  PlusIcon,
  UnderlineIcon,
} from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import { Group } from "@/registry/ui/group"
import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/ui/pagination"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group"

import { Cell, Sheet } from "./layout"

const SIZES = ["sm", "md", "lg"] as const

export function ActionsSheet() {
  return (
    <Sheet className="grid-cols-[1fr_380px]">
      <div className="flex flex-col gap-7">
        {SIZES.map((size) => (
          <Cell key={size} label={`button · ${size}`}>
            <Button size={size} variant="primary">
              Primary
            </Button>
            <Button size={size} variant="secondary">
              Secondary
            </Button>
            <Button size={size} variant="quiet">
              Quiet
            </Button>
            <Button size={size} variant="link">
              Link
            </Button>
            <Button size={size} variant="danger">
              Danger
            </Button>
            <Button size={size} variant="warning">
              Warning
            </Button>
            <Button size={size} variant="primary" isIconOnly aria-label="Add">
              <PlusIcon />
            </Button>
            <Button
              size={size}
              variant="secondary"
              isIconOnly
              aria-label="More"
            >
              <MoreHorizontalIcon />
            </Button>
            <Button size={size} variant="quiet" isIconOnly aria-label="Pin">
              <PinIcon />
            </Button>
          </Cell>
        ))}
        <Cell label="with icons">
          <Button variant="primary">
            <PlusIcon data-icon="inline-start" />
            New project
          </Button>
          <Button variant="secondary">
            <DownloadIcon data-icon="inline-start" />
            Export
          </Button>
          <Button variant="secondary">
            Continue
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
          <Button variant="primary" isPending>
            Saving
          </Button>
        </Cell>
        <Cell label="disabled">
          <Button variant="primary" isDisabled>
            Primary
          </Button>
          <Button variant="secondary" isDisabled>
            Secondary
          </Button>
          <Button variant="quiet" isDisabled>
            Quiet
          </Button>
          <Button variant="danger" isDisabled>
            Danger
          </Button>
        </Cell>
        <Cell label="pagination">
          <Pagination className="mx-0 w-auto">
            <PaginationList>
              <PaginationItem>
                <PaginationPrevious />
              </PaginationItem>
              {[1, 2, 3, 4].map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === 3}
                    aria-label={`Page ${page}`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink aria-label="Page 10">10</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext />
              </PaginationItem>
            </PaginationList>
          </Pagination>
        </Cell>
      </div>

      <div className="flex flex-col gap-7">
        <Cell label="toggle · off / on / icon on">
          <ToggleButton>
            <PinIcon data-icon="inline-start" />
            Pin
          </ToggleButton>
          <ToggleButton defaultSelected>
            <PinIcon data-icon="inline-start" />
            Pinned
          </ToggleButton>
          <ToggleButton defaultSelected isIconOnly aria-label="Bold">
            <BoldIcon />
          </ToggleButton>
        </Cell>
        <Cell label="button group">
          <Group aria-label="Actions">
            <Button>Merge</Button>
            <Button>Rebase</Button>
            <Button isIconOnly aria-label="More options">
              <ChevronDownIcon />
            </Button>
          </Group>
        </Cell>
        <Cell label="primary group">
          <Group aria-label="Publish">
            <Button variant="primary">Publish</Button>
            <Button variant="primary" isIconOnly aria-label="Publish options">
              <ChevronDownIcon />
            </Button>
          </Group>
        </Cell>
        <Cell label="toggle group">
          <ToggleButtonGroup
            aria-label="Text formatting"
            selectionMode="multiple"
            defaultSelectedKeys={["bold"]}
          >
            <ToggleButton id="bold" isIconOnly aria-label="Bold">
              <BoldIcon />
            </ToggleButton>
            <ToggleButton id="italic" isIconOnly aria-label="Italic">
              <ItalicIcon />
            </ToggleButton>
            <ToggleButton id="underline" isIconOnly aria-label="Underline">
              <UnderlineIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            aria-label="View"
            selectionMode="single"
            defaultSelectedKeys={["list"]}
          >
            <ToggleButton id="list">List</ToggleButton>
            <ToggleButton id="board">Board</ToggleButton>
            <ToggleButton id="timeline">Timeline</ToggleButton>
          </ToggleButtonGroup>
        </Cell>
        <Cell label="segmented control">
          <SegmentedControl defaultSelectedKeys={["week"]} aria-label="Range">
            <SegmentedControlItem id="day">Day</SegmentedControlItem>
            <SegmentedControlItem id="week">Week</SegmentedControlItem>
            <SegmentedControlItem id="month">Month</SegmentedControlItem>
            <SegmentedControlItem id="year">Year</SegmentedControlItem>
          </SegmentedControl>
        </Cell>
        <Cell label="focus · keyboard">
          <Button variant="primary" data-specimen-focus="">
            Primary
          </Button>
          <Button variant="secondary">Secondary</Button>
        </Cell>
      </div>
    </Sheet>
  )
}
