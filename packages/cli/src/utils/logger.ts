import { highlight } from "@/utils/highlight";

export const logger = {
  error(...args: unknown[]) {
    console.log(highlight.error(args.join(" ")));
  },
  warn(...args: unknown[]) {
    console.log(highlight.warn(args.join(" ")));
  },
  info(...args: unknown[]) {
    console.log(highlight.info(args.join(" ")));
  },
  success(...args: unknown[]) {
    console.log(highlight.success(args.join(" ")));
  },
  log(...args: unknown[]) {
    console.log(args.join(" "));
  },
  break() {
    console.log("");
  },
};
