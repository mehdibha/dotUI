export function isUrl(path: string) {
  try {
    new URL(path)
    return true
  } catch (error) {
    return false
  }
}