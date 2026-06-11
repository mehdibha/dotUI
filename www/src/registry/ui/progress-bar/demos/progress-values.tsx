import { ProgressBar } from '@/registry/ui/progress-bar'

const progressValues = [0, 25, 50, 75, 100]

export default function Demo() {
  return (
    <div className="flex w-full flex-col gap-4">
      {progressValues.map((value) => (
        <ProgressBar
          key={value}
          aria-label={`Progress ${value}%`}
          value={value}
          className="w-full"
        />
      ))}
    </div>
  )
}
