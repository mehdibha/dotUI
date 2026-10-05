import { Config } from "@remotion/cli/config"

import { makeWebpackOverride } from "./webpack"

// The CLI runs from video/ (pnpm --filter video …) and loads this file as CJS.
Config.setVideoImageFormat("jpeg")
Config.setJpegQuality(95)
Config.setConcurrency(3)
Config.setDelayRenderTimeoutInMilliseconds(120_000)
Config.overrideWebpackConfig(
  makeWebpackOverride({ root: process.cwd(), resolve: require.resolve }),
)
