import { TanStackDevtools } from "@tanstack/react-devtools"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"

// Default export so the hub can React.lazy() this chunk.
export default function Devtools() {
  return (
    <TanStackDevtools
      plugins={[
        { name: "TanStack Router", render: <TanStackRouterDevtoolsPanel /> },
      ]}
    />
  )
}
