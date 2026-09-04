import { Tab, TabList, TabPanel, Tabs } from "@/registry/ui/tabs"
import type {
  TabListProps,
  TabPanelProps,
  TabProps,
  TabsProps,
} from "@/registry/ui/tabs"

import { packageManagerStore } from "./install-commands"
import type { PackageManager } from "./install-commands"

/**
 * Code tabs. With a `groupId` (fumadocs' remarkNpm emits
 * `groupId="package-manager"` for ```npm blocks when `persist` is on, and the
 * install modals pass it by hand) the tabs are bound to `packageManagerStore`,
 * so every install snippet shows pnpm by default and follows the user's last
 * pick. Without one they are plain uncontrolled tabs.
 */
export function CodeBlockTabs({
  groupId,
  defaultValue,
  // Emitted alongside `groupId` by remarkNpm; not a DOM/Tabs prop.
  persist: _persist,
  children,
  ...props
}: Omit<TabsProps, "defaultSelectedKey"> & {
  groupId?: string
  defaultValue?: string
  persist?: boolean
}) {
  const packageManager = packageManagerStore.useValue()

  return (
    <Tabs
      className="mt-4 gap-2"
      defaultSelectedKey={defaultValue}
      {...props}
      {...(groupId
        ? {
            selectedKey: packageManager,
            onSelectionChange: (key) =>
              packageManagerStore.set(key as PackageManager),
          }
        : {})}
    >
      {children}
    </Tabs>
  )
}

export function CodeBlockTabsList(props: TabListProps) {
  return <TabList className="border bg-muted" {...props} />
}

export function CodeBlockTabsTrigger({
  value,
  ...props
}: Omit<TabProps, "id"> & { value?: string }) {
  return <Tab className="px-3" id={value} {...props} />
}

export function CodeBlockTab({
  value,
  ...props
}: Omit<TabPanelProps, "id"> & { value?: string }) {
  return (
    <TabPanel
      id={value}
      className="*:[figure]:mx-0 *:[figure]:mt-0"
      {...props}
    />
  )
}
