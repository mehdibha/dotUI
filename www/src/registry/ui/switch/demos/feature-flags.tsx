import { Badge } from '@/registry/ui/badge'
import { Description, FieldContent, Label } from '@/registry/ui/field'
import { Switch, SwitchControl, SwitchIndicator } from '@/registry/ui/switch'

const flags = [
  {
    key: 'new-dashboard',
    description: 'Redesigned analytics overview.',
    status: 'Stable',
    variant: 'success' as const,
    defaultSelected: true,
  },
  {
    key: 'ai-suggestions',
    description: 'Inline AI completions in the editor.',
    status: 'Beta',
    variant: 'info' as const,
    defaultSelected: true,
  },
  {
    key: 'edge-cache',
    description: 'Serve responses from the edge.',
    status: 'Experimental',
    variant: 'warning' as const,
    defaultSelected: false,
  },
]

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {flags.map((flag) => (
        <Switch
          key={flag.key}
          className="w-full"
          defaultSelected={flag.defaultSelected}
        >
          <SwitchControl>
            <FieldContent>
              <div className="flex items-center gap-2">
                <Label className="font-mono">{flag.key}</Label>
                <Badge appearance="subtle" variant={flag.variant} size="sm">
                  {flag.status}
                </Badge>
              </div>
              <Description>{flag.description}</Description>
            </FieldContent>
            <SwitchIndicator />
          </SwitchControl>
        </Switch>
      ))}
    </div>
  )
}
