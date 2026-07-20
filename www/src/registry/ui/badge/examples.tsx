import { ArrowRightIcon, BadgeCheckIcon } from '@/registry/icons'
import { Badge } from '@/registry/ui/badge'
import { Loader } from '@/registry/ui/loader'
import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

export default function BadgeExample() {
  return (
    <Examples className="lg:grid-cols-1">
      <BadgeVariants />
      <BadgeWithIconLeft />
      <BadgeWithIconRight />
      <BadgeWithSpinner />
      <BadgeLongText />
      <BadgeCustomColors />
    </Examples>
  )
}

function BadgeVariants() {
  return (
    <Example title="Variants">
      {(['solid', 'subtle'] as const).map((appearance) => (
        <div key={appearance} className="flex flex-wrap gap-2">
          {(
            [
              'neutral',
              'accent',
              'danger',
              'success',
              'warning',
              'info',
            ] as const
          ).map((variant) => (
            <Badge key={variant} appearance={appearance} variant={variant}>
              {variant}
              {appearance === 'solid' ? '' : '-subtle'}
            </Badge>
          ))}
        </div>
      ))}
    </Example>
  )
}

function BadgeWithIconLeft() {
  return (
    <Example title="Icon Left" className="max-w-fit">
      <div className="flex flex-wrap gap-2">
        {(
          ['neutral', 'accent', 'danger', 'success', 'warning', 'info'] as const
        ).map((variant) => (
          <Badge key={variant} variant={variant}>
            <BadgeCheckIcon data-icon="inline-start" />
            {variant}
          </Badge>
        ))}
      </div>
    </Example>
  )
}

function BadgeWithIconRight() {
  return (
    <Example title="Icon Right" className="max-w-fit">
      <div className="flex flex-wrap gap-2">
        {(
          ['neutral', 'accent', 'danger', 'success', 'warning', 'info'] as const
        ).map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
            <ArrowRightIcon data-icon="inline-end" />
          </Badge>
        ))}
      </div>
    </Example>
  )
}

function BadgeWithSpinner() {
  return (
    <Example title="With Spinner" className="max-w-fit">
      <div className="flex flex-wrap gap-2">
        {(
          ['neutral', 'accent', 'danger', 'success', 'warning', 'info'] as const
        ).map((variant) => (
          <Badge key={variant} variant={variant}>
            <Loader />
            {variant}
          </Badge>
        ))}
      </div>
    </Example>
  )
}

function BadgeLongText() {
  return (
    <Example title="Long Text">
      <div className="flex flex-wrap gap-2">
        <Badge>A badge with a lot of text to see how it wraps</Badge>
      </div>
    </Example>
  )
}

function BadgeCustomColors() {
  return (
    <Example title="Custom Colors" className="max-w-fit">
      <div className="flex flex-wrap gap-2">
        <Badge className="bg-blue-600 text-blue-50 dark:bg-blue-600 dark:text-blue-50">
          Blue
        </Badge>
        <Badge className="bg-green-600 text-green-50 dark:bg-green-600 dark:text-green-50">
          Green
        </Badge>
        <Badge className="bg-sky-600 text-sky-50 dark:bg-sky-600 dark:text-sky-50">
          Sky
        </Badge>
        <Badge className="bg-purple-600 text-purple-50 dark:bg-purple-600 dark:text-purple-50">
          Purple
        </Badge>
        <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          Blue
        </Badge>
        <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
          Green
        </Badge>
        <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
          Sky
        </Badge>
        <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
          Purple
        </Badge>
        <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
          Red
        </Badge>
      </div>
    </Example>
  )
}
