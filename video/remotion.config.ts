import { Config } from "@remotion/cli/config"

import { webpackOverride } from "./webpack"

Config.setVideoImageFormat("jpeg")
Config.setJpegQuality(95)
Config.setConcurrency(8)
Config.overrideWebpackConfig(webpackOverride)
