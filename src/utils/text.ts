export const truncateOnWord = (text: string, maxLength: number, ellipsis = true) => {
  if (text.length <= maxLength) return text;

  let truncatedText = text.substring(0, maxLength);

  truncatedText = truncatedText.substring(
    0,
    Math.min(truncatedText.length, truncatedText.lastIndexOf(" "))
  );

  if (ellipsis) truncatedText += "...";

  return truncatedText;
};
