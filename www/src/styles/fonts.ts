import { Josefin_Sans } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

export const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin",
});

export const fontSans = GeistSans;
export const fontMono = GeistMono;
