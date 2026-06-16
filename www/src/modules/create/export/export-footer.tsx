import { CommandCard, DeeplinkButton } from './renderers'
import { EXPORT_TARGETS } from './targets'
import { useExportUrl } from './use-export-url'

/**
 * The customizer footer's export block: renders every `EXPORT_TARGETS` entry,
 * each themed to the current preset via the shared `useExportUrl()` builder.
 */
export function ExportFooter() {
  const presetUrl = useExportUrl()

  return (
    <>
      {EXPORT_TARGETS.map((target) =>
        target.kind === 'command' ? (
          <CommandCard
            key={target.id}
            label={target.label}
            command={target.command(presetUrl)}
          />
        ) : (
          <DeeplinkButton
            key={target.id}
            label={target.label}
            ariaLabel={target.ariaLabel}
            icon={target.icon}
            href={target.href(presetUrl)}
          />
        ),
      )}
    </>
  )
}
