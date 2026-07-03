'use client'

import type * as React from 'react'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as SelectionIndicatorPrimitives from 'react-aria-components/SelectionIndicator'
import * as TabsPrimitives from 'react-aria-components/Tabs'
import { tv } from 'tailwind-variants'

import { createContext } from '@/lib/context'
const tabsVariants = tv({
  slots: {
    root: ['flex gap-2', '[--tabs-list-height:2rem]'],
    list: 'inline-flex w-fit items-center justify-center text-fg-muted',
    tab: [
      'relative isolate inline-flex flex-1 cursor-default items-center justify-center border border-transparent font-medium whitespace-nowrap focus-reset transition-[background-color,border-color,color,box-shadow] select-none focus-visible:focus-ring',
      'text-fg-muted hover:text-fg disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
      '**:[svg]:pointer-events-none **:[svg]:shrink-0',
      '[&:has([data-tab-indicator])_>_[data-tab-default-indicator]]:hidden',
      'gap-1.5 px-1.5 py-0.5 text-sm has-data-icon-end:pr-1 has-data-icon-start:pl-1 **:[svg]:not-with-[size]:size-4',
    ],
    selectionIndicator:
      'pointer-events-none absolute rounded-md duration-150 ease-out motion-safe:transition-[translate,width,height]',
    panel: ['flex-1 outline-none data-[inert=true]:hidden', 'text-sm'],
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'flex-col',
        list: 'h-(--tabs-list-height) flex-row',
        tab: 'h-[calc(100%-1px)]',
      },
      vertical: {
        root: 'flex-row',
        list: 'h-fit flex-col',
        tab: 'w-full justify-start',
      },
    },
    variant: {
      default: {
        list: 'rounded-lg bg-muted p-[3px]',
        tab: 'rounded-md selected:text-fg-on-selected',
        selectionIndicator: 'inset-0 bg-selected shadow-sm',
      },
      line: {
        list: 'gap-1 rounded-none bg-transparent p-[3px]',
        tab: 'rounded-md selected:text-fg',
        selectionIndicator:
          'rounded-full bg-fg orientation-horizontal:bottom-[-5px] orientation-horizontal:left-0 orientation-horizontal:h-0.5 orientation-horizontal:w-full orientation-vertical:top-0 orientation-vertical:-right-1 orientation-vertical:h-full orientation-vertical:w-0.5',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

type TabsVariant = 'default' | 'line'

const [TabsProvider, useTabsContext] = createContext<TabsProps['orientation']>({
  name: 'TabsContext',
})

const [TabListProvider, useTabListContext] = createContext<TabsVariant>({
  name: 'TabListContext',
})

interface TabsProps extends React.ComponentProps<typeof TabsPrimitives.Tabs> {}

const Tabs = ({ className, ...props }: TabsProps) => {
  const { root } = tabsVariants()
  return (
    <TabsPrimitives.Tabs
      className={composeRenderProps(className, (cn, { orientation }) =>
        root({ orientation, className: cn }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children, { orientation }) => (
        <TabsProvider value={orientation}>{children}</TabsProvider>
      ))}
    </TabsPrimitives.Tabs>
  )
}

interface TabListProps extends React.ComponentProps<
  typeof TabsPrimitives.TabList
> {
  variant?: TabsVariant
}

const TabList = ({
  className,
  variant = 'default',
  ...props
}: TabListProps) => {
  const { list } = tabsVariants()
  return (
    <TabListProvider value={variant}>
      <TabsPrimitives.TabList
        className={composeRenderProps(className, (cn, { orientation }) =>
          list({ orientation, variant, className: cn }),
        )}
        {...props}
      />
    </TabListProvider>
  )
}

interface TabProps extends React.ComponentProps<typeof TabsPrimitives.Tab> {}

const Tab = ({ className, ...props }: TabProps) => {
  const { tab } = tabsVariants()
  const orientation = useTabsContext('Tab')
  const variant = useTabListContext('Tab')
  return (
    <TabsPrimitives.Tab
      data-tab=""
      className={composeRenderProps(className, (cn) =>
        tab({ orientation, variant, className: cn }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          <TabIndicator />
          <span
            data-tab-content=""
            className="relative z-10 inline-flex items-center [gap:inherit]"
          >
            {children}
          </span>
        </>
      ))}
    </TabsPrimitives.Tab>
  )
}

interface TabIndicatorProps extends React.ComponentProps<
  typeof SelectionIndicatorPrimitives.SelectionIndicator
> {}

const TabIndicator = ({ className, ...props }: TabIndicatorProps) => {
  const { selectionIndicator } = tabsVariants()
  const orientation = useTabsContext('TabIndicator')
  const variant = useTabListContext('TabIndicator')
  return (
    <SelectionIndicatorPrimitives.SelectionIndicator
      data-tab-indicator=""
      data-orientation={orientation}
      className={composeRenderProps(className, (cn) =>
        selectionIndicator({ orientation, variant, className: cn }),
      )}
      {...props}
    />
  )
}

interface TabPanelProps extends React.ComponentProps<
  typeof TabsPrimitives.TabPanel
> {}

const TabPanel = ({ className, ...props }: TabPanelProps) => {
  const { panel } = tabsVariants()
  return (
    <TabsPrimitives.TabPanel
      data-tab-panel
      className={composeRenderProps(className, (cn) =>
        panel({ className: cn }),
      )}
      {...props}
    />
  )
}

export type {
  TabIndicatorProps,
  TabListProps,
  TabPanelProps,
  TabProps,
  TabsProps,
}
export { Tab, TabIndicator, TabList, TabPanel, Tabs }
