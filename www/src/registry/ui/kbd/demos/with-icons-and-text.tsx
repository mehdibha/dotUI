import { ArrowLeftIcon, CircleDashedIcon } from '@/registry/__generated__/icons'
import { Kbd, KbdGroup } from '@/registry/ui/kbd'

export default function Demo() {
  return (
    <KbdGroup>
      <Kbd>
        <ArrowLeftIcon />
        Left
      </Kbd>
      <Kbd>
        <CircleDashedIcon />
        Voice Enabled
      </Kbd>
    </KbdGroup>
  )
}
