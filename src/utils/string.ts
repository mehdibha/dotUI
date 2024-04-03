export function removeLastS(word: string): string {
  if (word.endsWith("s")) {
    return word.slice(0, -1);
  }
  return word;
}
