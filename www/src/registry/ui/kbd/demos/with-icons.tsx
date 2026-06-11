import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CircleDashedIcon,
} from '@/registry/__generated__/icons'
import { Kbd, KbdGroup } from '@/registry/ui/kbd'

export default function Demo() {
  return (
    <KbdGroup>
      <Kbd>
        <CircleDashedIcon />
      </Kbd>
      <Kbd>
        <ArrowLeftIcon />
      </Kbd>
      <Kbd>
        <ArrowRightIcon />
      </Kbd>
    </KbdGroup>
  )
}
