import { cn } from '@/registry/lib/utils'

/**
 * The macOS-style arrow shared by the component-gallery autoplay cursors. It dips
 * (scales down toward its tip) while `pressed`, so a click reads tactilely. The
 * hotspot — the arrow tip — sits at roughly (4px, 3px) from the top-left at the
 * default size; offset the pointer by that to land the tip on a target.
 */
export function Pointer({
  pressed = false,
  size = 20,
  className,
}: {
  pressed?: boolean
  size?: number
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn(
        'relative drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]',
        className,
      )}
      style={{
        transform: pressed ? 'scale(0.82)' : 'scale(1)',
        transformOrigin: '5px 4px',
        transition: 'transform 130ms cubic-bezier(0.32, 0.72, 0, 1)',
      }}
    >
      <path
        d="M5 3.5 L5 19 L9 15 L11.5 20.5 L14 19.3 L11.6 14 L17 14 Z"
        fill="white"
        stroke="black"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
    </svg>
  )
}
