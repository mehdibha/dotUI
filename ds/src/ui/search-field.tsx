'use client'

import type * as React from 'react'
import { SearchIcon } from 'lucide-react'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as SearchFieldPrimitives from 'react-aria-components/SearchField'

import { cn } from '@/lib/utils'
import { fieldVariants } from '@/ui/field'
import { Input, InputGroup, InputGroupAddon } from '@/ui/input'

interface SearchFieldProps extends React.ComponentProps<
  typeof SearchFieldPrimitives.SearchField
> {
  placeholder?: string
}

const SearchField = ({
  className,
  placeholder,
  ...props
}: SearchFieldProps) => {
  const fieldStyles = fieldVariants()
  return (
    <SearchFieldPrimitives.SearchField
      data-search-field=""
      data-slot="search-field"
      className={composeRenderProps(className, (className) =>
        cn(
          fieldStyles.field({ className }),
          'group/search-field empty:**:data-input-group-addon:*:data-button:not-[[slot]]:hidden **:data-input:[&::-webkit-search-cancel-button]:appearance-none **:data-input:[&::-webkit-search-decoration]:appearance-none',
        ),
      )}
      {...props}
    >
      {props?.children ?? (
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <Input placeholder={placeholder} />
        </InputGroup>
      )}
    </SearchFieldPrimitives.SearchField>
  )
}

export type { SearchFieldProps }
export { SearchField }
