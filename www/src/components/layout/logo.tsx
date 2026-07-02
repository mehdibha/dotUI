import { Link } from '@tanstack/react-router'
import { useTheme } from 'starter-themes'

import { siteConfig } from '@/config/site'
import { cn } from '@/registry/lib/utils'
import { ContextMenu } from '@/registry/ui/context-menu'
import { MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'

export function Logo({
  className,
  type = 'link',
}: {
  className?: string
  type?: 'link' | 'span'
}) {
  const { resolvedTheme } = useTheme()

  const copyBrandAsset = (file: string) => {
    fetch(`/brand/${file}`)
      .then((res) => res.text())
      .then((svg) => navigator.clipboard.writeText(svg))
      .catch(console.error)
  }

  const suffix = resolvedTheme === 'dark' ? '-white' : ''

  const mark = (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className="size-5"
    >
      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        rx="12"
        ry="12"
        className="fill-[#381e1e] dark:fill-white"
      />
      <circle
        cx="75"
        cy="75"
        r="11"
        className="fill-white dark:fill-[#381e1e]"
      />
    </svg>
  )

  return (
    <ContextMenu aria-label="Brand assets">
      {type === 'link' ? (
        <Link
          to="/"
          aria-label={`${siteConfig.name} home`}
          className={cn(
            'flex items-center opacity-100 transition-opacity duration-150 ease-out hover:opacity-80',
            className,
          )}
        >
          {mark}
        </Link>
      ) : (
        <span className={cn('flex items-center', className)}>{mark}</span>
      )}
      <Popover className="w-56">
        <MenuContent>
          <MenuItem onAction={() => copyBrandAsset(`dotui-logo${suffix}.svg`)}>
            Copy logo as SVG
          </MenuItem>
          <MenuItem
            onAction={() => copyBrandAsset(`dotui-wordmark${suffix}.svg`)}
          >
            Copy wordmark as SVG
          </MenuItem>
        </MenuContent>
      </Popover>
    </ContextMenu>
  )
}
