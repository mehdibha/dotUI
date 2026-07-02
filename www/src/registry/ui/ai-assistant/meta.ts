import type { RegistryItem } from '@/registry/types'

const aiAssistantMeta = {
  name: 'ai-assistant',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/ai-assistant/base.tsx',
      target: 'ui/ai-assistant.tsx',
    },
  ],
  registryDependencies: ['avatar', 'button', 'text-field', 'input'],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--ai-assistant-radius',
      default: '--radius-lg',
    },
  },
} satisfies RegistryItem

export default aiAssistantMeta
