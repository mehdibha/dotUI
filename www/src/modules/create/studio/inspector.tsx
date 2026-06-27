'use client'

import { BrandChapter } from './chapters/brand'
import { ColorChapter } from './chapters/color'
import { ComponentsChapter } from './chapters/components'
import { IconsChapter } from './chapters/icons'
import { InteractionChapter } from './chapters/interaction'
import { LayoutChapter } from './chapters/layout'
import { MaterialChapter } from './chapters/material'
import { MotionChapter } from './chapters/motion'
import { TypographyChapter } from './chapters/typography'
import type { ChapterId } from './data'
import { useStudio } from './store'

const CHAPTER_COMPONENTS: Record<ChapterId, () => React.ReactElement> = {
  brand: BrandChapter,
  color: ColorChapter,
  typography: TypographyChapter,
  layout: LayoutChapter,
  material: MaterialChapter,
  motion: MotionChapter,
  icons: IconsChapter,
  components: ComponentsChapter,
  interaction: InteractionChapter,
}

export function Inspector() {
  const { chapter } = useStudio()
  const Chapter = CHAPTER_COMPONENTS[chapter]

  return (
    <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto overscroll-contain">
      {/* `key={chapter}` remounts on chapter change, replaying the CSS fade-in.
          The fade is a pure CSS animation (see `.studio-enter` in styles.css):
          the resting state is fully visible, so content can never be stranded
          invisible the way a JS-driven enter animation can. */}
      <div key={chapter} className="studio-enter p-4">
        <Chapter />
      </div>
    </div>
  )
}
