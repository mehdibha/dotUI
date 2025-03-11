import pc from "picocolors";

export const c = {
  error: pc.red,
  warn: pc.yellow,
  info: pc.blue,
  success: pc.green,
};

export const logger = {
  error(...args: unknown[]) {
    console.log(c.error(args.join(" ")));
  },
  warn(...args: unknown[]) {
    console.log(c.warn(args.join(" ")));
  },
  info(...args: unknown[]) {
    console.log(c.info(args.join(" ")));
  },
  success(...args: unknown[]) {
    console.log(c.success(args.join(" ")));
  },
  log(...args: unknown[]) {
    console.log(args.join(" "));
  },
  break() {
    console.log("");
  },
};
