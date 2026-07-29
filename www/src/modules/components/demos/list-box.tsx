'use client'

import { ListBox, ListBoxItem } from '@/registry/ui/list-box'

import { useCycle } from '../autoplay'

const KEYS = ['nextjs', 'remix', 'astro', 'gatsby']

export function ListBoxDemo() {
  const { item } = useCycle(KEYS, { dwell: 1150 })
  return (
    <ListBox
      aria-label="Framework"
      selectionMode="single"
      selectedKeys={[item]}
      onSelectionChange={() => {}}
    >
      <ListBoxItem id="nextjs">Next.js</ListBoxItem>
      <ListBoxItem id="remix">Remix</ListBoxItem>
      <ListBoxItem id="astro">Astro</ListBoxItem>
      <ListBoxItem id="gatsby">Gatsby</ListBoxItem>
    </ListBox>
  )
}
