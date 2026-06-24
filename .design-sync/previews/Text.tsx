import { Text } from 'www'

const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  maxWidth: 520,
}

export const Paragraphs = () => (
  <div style={stack}>
    <Text elementType="p">
      The quick brown fox jumps over the lazy dog. Pack my box with five dozen
      liquor jugs — a pangram that exercises the full Latin alphabet at a
      readable body size.
    </Text>
    <Text elementType="p">
      Typography is the craft of arranging type to make written language
      legible, readable, and appealing when displayed. Good defaults carry most
      interfaces a long way.
    </Text>
  </div>
)

export const Slots = () => (
  <div style={stack}>
    <Text elementType="span" slot="label">
      Email address
    </Text>
    <Text elementType="span" slot="description">
      We'll only use this to send you account-related notifications.
    </Text>
  </div>
)
