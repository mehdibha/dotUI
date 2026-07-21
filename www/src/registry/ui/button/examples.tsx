import { ArrowLeftIcon, ArrowRightIcon } from '@/registry/icons'
import { Button } from '@/registry/ui/button'
import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

export default function ButtonExamples() {
  return (
    <Examples className="**:data-button:capitalize">
      <ButtonVariantsAndSizes />
      <ButtonIconRight />
      <ButtonIconLeft />
      <ButtonIconOnly />
    </Examples>
  )
}

const sizes = ['xs', 'sm', 'md', 'lg'] as const
const variants = ['primary', 'default', 'link', 'danger', 'quiet'] as const

const ButtonVariantsAndSizes = () => {
  return (
    <Example title="Variants and sizes">
      {sizes.map((size) => (
        <div key={size} className="flex w-full items-center gap-3">
          {variants.map((variant) => (
            <Button key={variant} size={size} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
      ))}
    </Example>
  )
}

const ButtonIconRight = () => {
  return (
    <Example title="Icon right">
      {sizes.map((size) => (
        <div key={size} className="flex w-full items-center gap-3">
          {variants.map((variant) => (
            <Button key={variant} size={size} variant={variant}>
              {variant}
              <ArrowRightIcon data-icon-end="" />
            </Button>
          ))}
        </div>
      ))}
    </Example>
  )
}

const ButtonIconLeft = () => {
  return (
    <Example title="Icon left">
      {sizes.map((size) => (
        <div key={size} className="flex w-full items-center gap-3">
          {variants.map((variant) => (
            <Button key={variant} size={size} variant={variant}>
              <ArrowLeftIcon data-icon-start="" />
              {variant}
            </Button>
          ))}
        </div>
      ))}
    </Example>
  )
}

const ButtonIconOnly = () => {
  return (
    <Example title="Icon only">
      {sizes.map((size) => (
        <div key={size} className="flex w-full items-center gap-3">
          {variants.map((variant) => (
            <Button key={variant} size={size} variant={variant} isIconOnly>
              <ArrowRightIcon />
            </Button>
          ))}
        </div>
      ))}
    </Example>
  )
}
