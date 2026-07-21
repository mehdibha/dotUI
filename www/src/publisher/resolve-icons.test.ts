import { describe, expect, it } from 'vitest'

import { resolveIconImports } from './resolve-icons'

const SINGLE = `import { ChevronDownIcon } from "@/components/icons";\nexport {};`

const MULTILINE = `import {
\tCircleAlertIcon,
\tCircleCheckIcon,
\tXIcon,
} from "@/components/icons";
export {};`

describe('resolveIconImports', () => {
  it('resolves the marker to lucide-react by default', () => {
    expect(resolveIconImports(SINGLE)).toContain(
      'import { ChevronDownIcon } from "lucide-react";',
    )
    expect(resolveIconImports(SINGLE)).not.toContain('@/components/icons')
  })

  it('parses multi-line named imports', () => {
    const out = resolveIconImports(MULTILINE, 'lucide')
    expect(out).toContain(
      'import { CircleAlertIcon, CircleCheckIcon, XIcon } from "lucide-react";',
    )
  })

  it('aliases remix names onto the registry names', () => {
    const out = resolveIconImports(SINGLE, 'remix')
    expect(out).toContain(
      'import { RiArrowDownSLine as ChevronDownIcon } from "@remixicon/react";',
    )
  })

  it('aliases tabler names onto the registry names', () => {
    const out = resolveIconImports(MULTILINE, 'tabler')
    expect(out).toContain(
      'import { IconExclamationCircle as CircleAlertIcon, IconCircleCheck as CircleCheckIcon, IconX as XIcon } from "@tabler/icons-react";',
    )
  })

  it('falls back to lucide for icons with no mapping', () => {
    const src = `import { ChevronDownIcon, MadeUpIcon } from "@/components/icons";`
    const out = resolveIconImports(src, 'tabler')
    expect(out).toContain(
      'import { IconChevronDown as ChevronDownIcon } from "@tabler/icons-react";',
    )
    expect(out).toContain('import { MadeUpIcon } from "lucide-react";')
  })

  it('wraps hugeicons data into components', () => {
    const out = resolveIconImports(SINGLE, 'hugeicons')
    expect(out).toContain('import { HugeiconsIcon } from "@hugeicons/react";')
    expect(out).toContain(
      'import type { HugeiconsIconProps } from "@hugeicons/react";',
    )
    expect(out).toContain(
      'import { ArrowDown01Icon as ChevronDownIconData } from "@hugeicons/core-free-icons";',
    )
    expect(out).toContain(
      'function ChevronDownIcon({ className, ...props }: Omit<HugeiconsIconProps, "icon">) {',
    )
    expect(out).toContain('icon={ChevronDownIconData}')
  })

  it('emits hugeicons wrappers after the whole import block', () => {
    const src = `import { ChevronDownIcon } from "@/components/icons";\nimport { cn } from "@/lib/utils";\n\nexport {};`
    const out = resolveIconImports(src, 'hugeicons')
    const wrapperAt = out.indexOf('function ChevronDownIcon')
    const lastImportAt = out.indexOf('import { cn }')
    expect(wrapperAt).toBeGreaterThan(lastImportAt)
    expect(out.indexOf('export {}')).toBeGreaterThan(wrapperAt)
  })

  it('imports HugeiconsIcon only once across several marker imports', () => {
    const src = `${SINGLE}\nimport { XIcon } from "@/components/icons";`
    const out = resolveIconImports(src, 'hugeicons')
    expect(out.match(/import \{ HugeiconsIcon \} from/g)).toHaveLength(1)
    expect(out).toContain('Cancel01Icon as XIconData')
  })

  it('leaves files without the marker untouched', () => {
    const src = `import { XIcon } from "lucide-react";\nexport {};`
    expect(resolveIconImports(src, 'remix')).toBe(src)
  })

  it('adds the hugeicon marker class to hugeicons wrappers', () => {
    const out = resolveIconImports(SINGLE, 'hugeicons')
    expect(out).toContain('className ? `hugeicon ${className}` : "hugeicon"')
  })

  it('aliases phosphor names, skipping the alias when names match', () => {
    const src = `import { ChevronDownIcon, XIcon } from "@/components/icons";`
    const out = resolveIconImports(src, 'phosphor')
    expect(out).toContain(
      'import { CaretDownIcon as ChevronDownIcon, XIcon } from "@phosphor-icons/react";',
    )
  })

  it('wraps phosphor icons when a weight is set', () => {
    const out = resolveIconImports(SINGLE, 'phosphor', { weight: 'bold' })
    expect(out).toContain(
      'import type { IconProps } from "@phosphor-icons/react";',
    )
    expect(out).toContain(
      'import { CaretDownIcon as PhosphorChevronDownIcon } from "@phosphor-icons/react";',
    )
    expect(out).toContain('function ChevronDownIcon(props: IconProps) {')
    expect(out).toContain(
      '<PhosphorChevronDownIcon weight="bold" {...props} />',
    )
  })

  it('treats regular and invalid weights as the phosphor default', () => {
    for (const weight of ['regular', 'chunky; alert(1)', undefined]) {
      const out = resolveIconImports(SINGLE, 'phosphor', { weight })
      expect(out).toContain(
        'import { CaretDownIcon as ChevronDownIcon } from "@phosphor-icons/react";',
      )
      expect(out).not.toContain('function ChevronDownIcon')
    }
  })
})
