import { Text } from "@/registry/ui/text"
import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

export default function TypographyGroupExamples() {
  return (
    <Examples>
      <Example title="Text">
        <div className="flex flex-col gap-3">
          <Text>This is body text styled by the design system.</Text>
          <Text className="text-sm text-fg-muted">
            Secondary muted text, useful for captions and hints.
          </Text>
        </div>
      </Example>
    </Examples>
  )
}
