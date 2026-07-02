/**
 * A chat-style voice message bubble: a play/pause control, a `wavesurfer.js`
 * waveform, and an elapsed/total duration readout. Click or drag the waveform
 * to seek. Theming (wave and progress colors) is resolved from dotUI tokens at
 * runtime.
 */
export interface VoiceMessageProps extends Omit<
  React.ComponentProps<'div'>,
  'children'
> {
  /** The audio source URL to play. */
  src: string
  /**
   * Total duration in seconds, shown before the audio metadata loads. Once the
   * waveform is ready the real duration replaces it.
   */
  duration?: number
}
