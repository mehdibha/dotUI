export function isUrl(path: string) {
  try {
    new URL(path);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false;
  }
}
