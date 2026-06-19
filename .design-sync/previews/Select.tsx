import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'www'

export const Open = () => (
  <Select defaultOpen aria-label="Provider" defaultSelectedKey="perplexity" style={{ width: 240 }}>
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem id="perplexity">Perplexity</SelectItem>
      <SelectItem id="replicate">Replicate</SelectItem>
      <SelectItem id="together-ai">Together AI</SelectItem>
      <SelectItem id="eleven-labs">ElevenLabs</SelectItem>
    </SelectContent>
  </Select>
)

export const WithLabel = () => (
  <Select defaultSelectedKey="next" style={{ width: 240 }}>
    <Label>Framework</Label>
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem id="next">Next.js</SelectItem>
      <SelectItem id="remix">Remix</SelectItem>
      <SelectItem id="astro">Astro</SelectItem>
      <SelectItem id="nuxt">Nuxt</SelectItem>
    </SelectContent>
  </Select>
)
