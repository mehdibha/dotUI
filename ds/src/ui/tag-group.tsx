'use client'

import { XIcon } from 'lucide-react'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as TagGroupPrimitives from 'react-aria-components/TagGroup'
import { tv } from 'tailwind-variants'

import { Button } from '@/ui/button'
const tagGroupVariants = tv({
  slots: {
    tagGroup: 'group/tag-group flex flex-col gap-2',
    tagList: [
      'flex flex-wrap items-center outline-hidden',
      'empty:text-fg-muted',
      'gap-1',
    ],
    tag: [
      'group/tag relative inline-flex w-fit shrink-0 cursor-default items-center justify-center gap-1 rounded-md font-medium whitespace-nowrap outline-hidden transition-colors select-none data-react-aria-pressable:cursor-interactive',
      'bg-(--neutral-300) text-fg-on-neutral selected:bg-accent-muted selected:text-fg-accent',
      '**:[svg]:pointer-events-none **:[svg]:shrink-0',
      'focus-visible:focus-ring',
      'data-href:cursor-interactive',
      'disabled:bg-disabled disabled:text-fg-disabled data-selection-mode:disabled:cursor-disabled',
      'text-xs/relaxed **:[svg]:not-with-[size]:size-3',
      'has-[button[slot=remove]]:pr-0 **:[button[slot=remove]]:-ml-1 **:[button[slot=remove]]:size-5 **:[button[slot=remove]]:rounded-none **:[button[slot=remove]]:bg-transparent **:[button[slot=remove]]:text-fg-muted **:[button[slot=remove]]:hover:text-fg',
      'group-data-[size=sm]/tag-group:h-4.25',
      'h-5.25 px-1.5',
      'group-data-[size=lg]/tag-group:h-6.25 group-data-[size=lg]/tag-group:text-sm',
    ],
  },
})

interface TagGroupProps extends TagGroupPrimitives.TagGroupProps {
  size?: 'sm' | 'md' | 'lg'
}

function TagGroup({ className, size = 'md', ...props }: TagGroupProps) {
  const { tagGroup } = tagGroupVariants()
  return (
    <TagGroupPrimitives.TagGroup
      data-tag-group=""
      data-size={size}
      className={tagGroup({ className })}
      {...props}
    />
  )
}

interface TagListProps<T> extends TagGroupPrimitives.TagListProps<T> {}

function TagList<T extends object>({ className, ...props }: TagListProps<T>) {
  const { tagList } = tagGroupVariants()
  return (
    <TagGroupPrimitives.TagList
      data-tag-list=""
      className={composeRenderProps(className, (cn) =>
        tagList({ className: cn }),
      )}
      {...props}
    />
  )
}

interface TagProps extends TagGroupPrimitives.TagProps {}

function Tag({ className, ...props }: TagProps) {
  const { tag } = tagGroupVariants()
  const textValue =
    typeof props.children === 'string' ? props.children : undefined

  return (
    <TagGroupPrimitives.Tag
      data-tag=""
      textValue={textValue}
      className={composeRenderProps(className, (className) =>
        tag({ className }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children, { allowsRemoving }) => (
        <>
          {children}
          {allowsRemoving && (
            <Button slot="remove" variant="quiet" isIconOnly size="xs">
              <XIcon />
            </Button>
          )}
        </>
      ))}
    </TagGroupPrimitives.Tag>
  )
}

export type { TagGroupProps, TagListProps, TagProps }
export { Tag, TagGroup, TagList }
