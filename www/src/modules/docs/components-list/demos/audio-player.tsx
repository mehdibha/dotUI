'use client'

import {
  AudioPlayer,
  AudioPlayerMuteButton,
  AudioPlayerPlayButton,
  AudioPlayerTime,
} from '@/registry/ui/audio-player'
import { Slider, SliderControl } from '@/registry/ui/slider'

import { useValueAutoplay } from '../autoplay'

// The seek position is simulated (no audio loads on the gallery page); the CSS
// transitions glide the fill/thumb between waypoints, like the slider demo.
export function AudioPlayerDemo() {
  const { value } = useValueAutoplay([64, 96, 128, 176], { dwell: 850 })
  const time = `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`
  return (
    <AudioPlayer className="w-full max-w-[17rem]">
      <AudioPlayerPlayButton />
      <AudioPlayerTime>{time}</AudioPlayerTime>
      <Slider
        aria-label="Seek"
        value={value}
        onChange={() => {}}
        minValue={0}
        maxValue={225}
        className="grow [&_[data-slider-fill]]:transition-[width,inset-inline-start] [&_[data-slider-fill]]:duration-700 [&_[data-slider-fill]]:ease-out [&_[data-slider-thumb]]:transition-[left,inset-inline-start] [&_[data-slider-thumb]]:duration-700 [&_[data-slider-thumb]]:ease-out"
      >
        <SliderControl />
      </Slider>
      <AudioPlayerTime>3:45</AudioPlayerTime>
      <AudioPlayerMuteButton />
    </AudioPlayer>
  )
}
