'use client'

import { ListBox, ListBoxItem } from '@/registry/ui/list-box'

import { useStepAutoplay } from '../autoplay'

const KEYS = ['nextjs', 'remix', 'astro', 'gatsby']

export function ListBoxDemo() {
  const { index } = useStepAutoplay(KEYS.length, { dwell: 1150 })
  return (
    <ListBox
      aria-label="Framework"
      selectionMode="single"
      selectedKeys={[KEYS[index]]}
      onSelectionChange={() => {}}
    >
      <ListBoxItem id="nextjs">Next.js</ListBoxItem>
      <ListBoxItem id="remix">Remix</ListBoxItem>
      <ListBoxItem id="astro">Astro</ListBoxItem>
      <ListBoxItem id="gatsby">Gatsby</ListBoxItem>
    </ListBox>
  )
}
