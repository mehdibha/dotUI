declare function plugin(
  options?: Partial<{
    cssFile: string
    cssfile: string
    source: string | string[]
    cwd: string
    logLevel: 'silent' | 'warn' | 'error'
    loglevel: 'silent' | 'warn' | 'error'
  }>,
): {
  handler: () => void
}

declare namespace plugin {
  const __isOptionsFunction: true
}

export = plugin
