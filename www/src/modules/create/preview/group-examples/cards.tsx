import { CardsMasonry } from '@/components/showcase/cards-grid'

// The "Cards" preview view: the same real-world card blocks as the landing
// page, rendered inside the /create preview iframe so the user's whole design
// system (colors, radius, density, typography, per-component params) can be
// judged at a glance on realistic UI. Unlike the landing composition there are
// no skeleton rails or edge fade — just a centered masonry, with fewer columns
// to suit the narrower preview pane.
export default function CardsExamples() {
  return (
    <div className="w-full p-4 sm:p-6">
      <CardsMasonry className="mx-auto max-w-6xl" />
    </div>
  )
}
