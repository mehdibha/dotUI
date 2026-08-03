import { TextArea } from '@/registry/ui/input'

export function TextAreaDemo() {
  return (
    <TextArea
      defaultValue="Tell us a bit about yourself."
      placeholder="Enter description..."
      className="w-full max-w-[11.5rem]"
    />
  )
}
