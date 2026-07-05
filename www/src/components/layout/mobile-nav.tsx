import React from 'react'
import { Link } from '@tanstack/react-router'
import type * as PageTree from 'fumadocs-core/page-tree'

import { navItems } from '@/config/site'
import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { Drawer } from '@/registry/ui/drawer'

export function MobileNav({ items }: { items: PageTree.Node[] }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        aria-label="Toggle Menu"
        variant="quiet"
        size="md"
        isIconOnly
        className="relative flex items-center justify-center lg:hidden"
      >
        <div className="relative h-3.5 w-4 [&>span]:absolute [&>span]:left-0 [&>span]:block [&>span]:h-0.5 [&>span]:w-4 [&>span]:rounded-full [&>span]:bg-fg [&>span]:transition-all [&>span]:duration-150 [&>span]:ease-out">
          <span
            className={cn(
              'top-0.25',
              isOpen && 'translate-y-[0.31rem] -rotate-45',
            )}
          />
          <span className={cn('top-1.5', isOpen && '-rotate-45 opacity-0')} />
          <span
            className={cn(
              'top-2.75',
              isOpen && 'translate-y-[-0.31rem] rotate-45',
            )}
          />
        </div>
      </Button>
      <Drawer>
        <DialogContent aria-label="Mobile navigation" className="p-0">
          <nav
            aria-label="Mobile"
            className="no-scrollbar flex min-h-0 flex-1 scroll-fade-y flex-col gap-12 overflow-y-auto p-6"
          >
            <div className="space-y-2">
              <div className="text-lg font-medium text-fg-muted">Menu</div>
              <div className="flex flex-col gap-3">
                <MobileLink to="/" onOpenChange={setIsOpen}>
                  Home
                </MobileLink>
                {navItems.map((item) => (
                  <MobileLink
                    key={item.name}
                    to={item.to}
                    params={item.params}
                    onOpenChange={setIsOpen}
                  >
                    {item.name}
                  </MobileLink>
                ))}
              </div>
            </div>
            {items?.map((group, index) => {
              if (group.type === 'folder') {
                return (
                  // oxlint-disable-next-line react/no-array-index-key -- items is static navigation data
                  <div key={index} className="flex flex-col gap-3">
                    <div className="text-lg font-medium text-fg-muted">
                      {group.name}
                    </div>
                    <div className="flex flex-col gap-3">
                      {group.children.map((item) => {
                        if (item.type === 'page') {
                          return (
                            <MobileLink
                              key={item.url}
                              to={item.url}
                              onOpenChange={setIsOpen}
                            >
                              {item.name}
                            </MobileLink>
                          )
                        }
                        return null
                      })}
                    </div>
                  </div>
                )
              }
              return null
            })}
          </nav>
        </DialogContent>
      </Drawer>
    </Dialog>
  )
}

function MobileLink({
  to,
  params,
  onOpenChange,
  className,
  children,
}: {
  to: string
  params?: { _splat: string }
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      to={to}
      params={params}
      onClick={() => onOpenChange?.(false)}
      className={cn('text-2xl font-medium', className)}
    >
      {children}
    </Link>
  )
}
