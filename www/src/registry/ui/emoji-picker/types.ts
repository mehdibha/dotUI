import type { EmojiPickerRootProps } from 'frimousse'

/**
 * An emoji picker panel — search, categories, and a virtualized grid — built
 * on the headless [frimousse](https://frimousse.liveblocks.io) engine with
 * dotUI chrome. Drop it inside a React Aria `Popover` for the usual
 * trigger-and-overlay pattern. `onEmojiSelect` fires with the chosen emoji.
 */
export interface EmojiPickerProps extends EmojiPickerRootProps {}
