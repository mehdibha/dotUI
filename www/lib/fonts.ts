import {
  DM_Sans,
  Geist,
  Geist_Mono,
  Inter,
  Josefin_Sans,
  Montserrat,
  Nunito,
  Open_Sans,
  Raleway,
  Roboto,
  Work_Sans,
} from "next/font/google";

// Primary fonts with CSS variables for Tailwind
export const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin",
  display: "swap",
});

// Additional built-in fonts (className only)
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
});

export const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

export const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
});

export const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
});
