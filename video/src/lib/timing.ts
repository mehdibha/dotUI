/* The film runs on a 120 BPM grid at 60 fps: a beat is 30 frames, a bar
   (4 beats) is 2 s. Scene lengths and cuts are counted in bars so the edit
   stays on the music; pick a track at 120 BPM (or change BPM and everything
   rescales). */

export const FPS = 60
export const BPM = 120
export const BEAT = Math.round((FPS * 60) / BPM)
export const BAR = BEAT * 4
export const WIDTH = 1920
export const HEIGHT = 1080

/** Frame of `beat` (0-based, may be fractional) within `bar` (0-based). */
export const at = (bar: number, beat = 0) => Math.round(bar * BAR + beat * BEAT)

/** Frames in `n` beats. */
export const beats = (n: number) => Math.round(n * BEAT)

/** Frames in `n` bars. */
export const bars = (n: number) => Math.round(n * BAR)
