export function removeLastS(word: string): string {
  if (word.endsWith("s")) {
    return word.slice(0, -1);
  }
  return word;
}

export function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

export const toKebabCase = (string: string): string => {
  return string
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .trim();
};

export const kekabCaseToTitle = (string: string): string => {
  return string
    .replace(/-/g, " ")
    .replace(/^\w/, (char) => char.toUpperCase());
};

export const truncateOnWord = (
  text: string,
  maxLength: number,
  ellipsis = true
) => {
  if (text.length <= maxLength) return text;
  let truncatedText = text.substring(0, maxLength);
  truncatedText = truncatedText.substring(
    0,
    Math.min(truncatedText.length, truncatedText.lastIndexOf(" "))
  );
  if (ellipsis) truncatedText += "...";
  return truncatedText;
};
