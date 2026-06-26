import { CardsGrid } from '@/components/showcase/cards-grid'

// The "Cards" preview view: the same bento of real-world card blocks as the
// landing page, rendered inside the /create preview iframe so the user's whole
// design system (colors, radius, density, typography, per-component params) can be
// judged at a glance on realistic UI. Unlike the landing composition there are no
// skeleton rails or edge fade — just the centered grid, with fewer columns to suit
// the narrower preview pane. `featuredClassName` re-pins the AI-prompt card for
// this 1–3-up layout: full width until there are three columns, then top-right.
export default function CardsExamples() {
  return (
    <div className="w-full p-4 sm:p-6">
      <CardsGrid className="mx-auto max-w-6xl" variant="preview" />
    </div>
  )
}
