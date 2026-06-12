import type { Control, ControlValues, SerializableControl } from './types'

/**
 * Default value semantics for a control, shared by the InteractiveDemo client
 * component and the build/test pipeline so they can never disagree.
 */
export function getDefaultControlValue(
  control: Control | SerializableControl,
): unknown {
  switch (control.type) {
    case 'boolean':
      return control.defaultValue ?? false
    case 'string':
      return control.defaultValue ?? ''
    case 'number':
      return control.defaultValue ?? 0
    case 'enum':
      return control.defaultValue ?? control.options[0]
    case 'icon':
      return null
    default:
      return undefined
  }
}

export function defaultControlValues(
  controls: readonly (Control | SerializableControl)[],
): ControlValues {
  const values: ControlValues = {}
  for (const control of controls) {
    values[control.name] = getDefaultControlValue(control)
  }
  return values
}
