import {
  ClockIcon,
  MapIcon,
  PinIcon,
  ShareIcon,
  StarIcon,
} from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Sheet, SheetHandle } from "@/registry/ui/sheet"

const REVIEWS = [
  ["Nadia", "Best flat white in the neighborhood. Window seats fill up early."],
  ["Theo", "Quiet in the mornings, good wifi, kind staff."],
  ["Imen", "The cardamom bun alone is worth the walk."],
  ["Jonas", "Busy at lunch, but the line moves fast."],
]

export function SnapPointsScene() {
  return (
    <div className="relative h-52 w-full max-w-80 overflow-hidden rounded-xl border bg-muted">
      <MapIllustration />
      <Dialog>
        <Button
          variant="primary"
          size="sm"
          className="absolute top-[42%] left-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg"
        >
          <PinIcon />
          Harborlight
        </Button>
        <Sheet snapPoints={[280]}>
          <DialogContent>
            <SheetHandle />
            <DialogHeader>
              <DialogTitle>Harborlight Coffee</DialogTitle>
              <DialogDescription>
                Coffee shop · 0.3 mi · Open until 6 PM
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="gap-5">
              <div className="flex gap-2">
                <Button variant="primary" className="flex-1">
                  <MapIcon />
                  Directions
                </Button>
                <Button variant="secondary" isIconOnly aria-label="Hours">
                  <ClockIcon />
                </Button>
                <Button variant="secondary" isIconOnly aria-label="Share">
                  <ShareIcon />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  "from-amber-200 to-orange-300",
                  "from-stone-200 to-stone-400",
                  "from-emerald-200 to-teal-300",
                ].map((gradient) => (
                  <div
                    key={gradient}
                    aria-hidden
                    className={`aspect-square rounded-lg bg-linear-to-br ${gradient} dark:opacity-70`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <StarIcon className="size-4 fill-current text-warning" />
                <span className="font-medium">4.8</span>
                <span className="text-fg-muted">· 1,204 reviews</span>
              </div>
              <ul className="divide-y">
                {REVIEWS.map(([name, text]) => (
                  <li key={name} className="py-3 first:pt-0">
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-sm text-fg-muted">{text}</p>
                  </li>
                ))}
              </ul>
            </DialogBody>
          </DialogContent>
        </Sheet>
      </Dialog>
    </div>
  )
}

// Streets, a park and the waterfront, drawn in the theme's own surfaces so the
// map follows light and dark.
function MapIllustration() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 320 208"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
    >
      <path
        d="M0 168 C80 150 140 190 220 170 S300 150 320 160 V208 H0Z"
        className="fill-info-muted"
      />
      <rect
        x="196"
        y="22"
        width="84"
        height="58"
        rx="10"
        className="fill-success-muted"
      />
      <g className="stroke-bg" fill="none" strokeLinecap="round">
        <path d="M-10 60 L330 96" strokeWidth="14" />
        <path d="M120 -10 L150 220" strokeWidth="14" />
        <path d="M-10 128 L330 120" strokeWidth="8" />
        <path d="M40 -10 L64 220" strokeWidth="8" />
        <path d="M250 -10 L236 220" strokeWidth="8" />
      </g>
    </svg>
  )
}
