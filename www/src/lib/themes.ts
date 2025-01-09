import { Theme } from "@/types/theme";

export const dotUIThemes: Theme[] = [
  {
    id: "default",
    name: "Default",
    defaultMode: "dark",
    fonts: {
      heading: "inter",
      body: "josefin",
    },
    radius: 0.5,
    iconLibrary: "lucide",
    variants: {
      loader: "loader-ring",
      button: "button-01",
      calendar: "calendar-01",
    },
    colors: {
      light: {
        neutral: {
          baseColor: "#ffffff",
          shades: [
            "hsl(0, 0%, 98%)", // --color-neutral-100
            "hsl(0, 0%, 94%)", // --color-neutral-200
            "hsl(0, 0%, 90%)", // --color-neutral-300
            "hsl(0, 0%, 85%)", // --color-neutral-400
            "hsl(0, 0%, 80%)", // --color-neutral-500
            "hsl(0, 0%, 40%)", // --color-neutral-600
            "hsl(0, 0%, 35%)", // --color-neutral-700
            "hsl(0, 0%, 28%)", // --color-neutral-800
            "hsl(0, 0%, 16%)", // --color-neutral-900
            "hsl(0, 0%, 12%)", // --color-neutral-1000
          ],
        },
        accent: {
          baseColor: "#0091FF",
          shades: [
            "hsl(210, 100%, 88%)", // --color-accent-100
            "hsl(210, 100%, 81%)", // --color-accent-200
            "hsl(210, 100%, 74%)", // --color-accent-300
            "hsl(210, 100%, 67%)", // --color-accent-400
            "hsl(210, 64%, 55%)", // --color-accent-500
            "hsl(210, 51%, 44%)", // --color-accent-600
            "hsl(210, 51%, 36%)", // --color-accent-700
            "hsl(210, 52%, 29%)", // --color-accent-800
            "hsl(211, 52%, 17%)", // --color-accent-900
            "hsl(211, 52%, 12%)", // --color-accent-1000
          ],
        },
        danger: {
          baseColor: "#D93036",
          shades: [
            "hsl(358, 69%, 90%)", // --color-danger-100
            "hsl(358, 69%, 85%)", // --color-danger-200
            "hsl(358, 70%, 79%)", // --color-danger-300
            "hsl(358, 69%, 73%)", // --color-danger-400
            "hsl(358, 69%, 63%)", // --color-danger-500
            "hsl(358, 64%, 49%)", // --color-danger-600
            "hsl(358, 63%, 41%)", // --color-danger-700
            "hsl(358, 64%, 33%)", // --color-danger-800
            "hsl(357, 64%, 20%)", // --color-danger-900
            "hsl(358, 65%, 15%)", // --color-danger-1000
          ],
        },
        warning: {
          baseColor: "#E79D13",
          shades: [
            "hsl(35, 100%, 80%)", // --color-warning-100
            "hsl(35, 100%, 69%)", // --color-warning-200
            "hsl(35, 100%, 58%)", // --color-warning-300
            "hsl(35, 93%, 49%)", // --color-warning-400
            "hsl(35, 92%, 41%)", // --color-warning-500
            "hsl(35, 93%, 32%)", // --color-warning-600
            "hsl(35, 93%, 26%)", // --color-warning-700
            "hsl(35, 93%, 22%)", // --color-warning-800
            "hsl(35, 94%, 12%)", // --color-warning-900
            "hsl(36, 91%, 9%)", // --color-warning-1000
          ],
        },
        success: {
          baseColor: "#1A9338",
          shades: [
            "hsl(130, 34%, 83%)", // --color-success-100
            "hsl(131, 35%, 75%)", // --color-success-200
            "hsl(131, 35%, 66%)", // --color-success-300
            "hsl(132, 35%, 56%)", // --color-success-400
            "hsl(131, 41%, 43%)", // --color-success-500
            "hsl(132, 41%, 34%)", // --color-success-600
            "hsl(132, 41%, 28%)", // --color-success-700
            "hsl(131, 41%, 23%)", // --color-success-800
            "hsl(131, 40%, 13%)", // --color-success-900
            "hsl(132, 42%, 9%)", // --color-success-1000
          ],
        },
        lightness: 100,
        saturation: 100,
      },
      dark: {
        neutral: {
          baseColor: "#000000",
          shades: [
            "hsl(240, 6%, 8%)", // --color-neutral-100
            "hsl(240, 6%, 13%)", // --color-neutral-200
            "hsl(240, 6%, 19%)", // --color-neutral-300
            "hsl(240, 6%, 25%)", // --color-neutral-400
            "hsl(240, 6%, 33%)", // --color-neutral-500
            "hsl(240, 6%, 47%)", // --color-neutral-600
            "hsl(240, 6%, 55%)", // --color-neutral-700
            "hsl(240, 6%, 70%)", // --color-neutral-800
            "hsl(240, 6%, 85%)", // --color-neutral-900
            "hsl(240, 10%, 98%)", // --color-neutral-1000
          ],
        },
        accent: {
          baseColor: "#0091FF",
          shades: [
            "hsl(211, 51%, 12%)", // --color-accent-100
            "hsl(211, 52%, 18%)", // --color-accent-200
            "hsl(210, 52%, 29%)", // --color-accent-300
            "hsl(209, 51%, 40%)", // --color-accent-400
            "hsl(210, 52%, 48%)", // --color-accent-500
            "hsl(210, 51%, 55%)", // --color-accent-600
            "hsl(210, 68%, 62%)", // --color-accent-700
            "hsl(210, 97%, 71%)", // --color-accent-800
            "hsl(210, 100%, 82%)", // --color-accent-900
            "hsl(210, 100%, 87%)", // --color-accent-1000
          ],
        },
        danger: {
          baseColor: "#D93036",
          shades: [
            "hsl(357, 64%, 14%)", // --color-danger-100
            "hsl(358, 64%, 21%)", // --color-danger-200
            "hsl(358, 64%, 26%)", // --color-danger-300
            "hsl(358, 64%, 32%)", // --color-danger-400
            "hsl(358, 64%, 42%)", // --color-danger-500
            "hsl(358, 69%, 51%)", // --color-danger-600
            "hsl(358, 69%, 60%)", // --color-danger-700
            "hsl(358, 69%, 70%)", // --color-danger-800
            "hsl(359, 70%, 86%)", // --color-danger-900
            "hsl(358, 69%, 90%)", // --color-danger-1000
          ],
        },
        warning: {
          baseColor: "#E79D13",
          shades: [
            "hsl(34, 100%, 10%)", // --color-warning-100
            "hsl(34, 100%, 20%)", // --color-warning-200
            "hsl(35, 100%, 40%)", // --color-warning-300
            "hsl(35, 100%, 48%)", // --color-warning-400
            "hsl(35, 100%, 50%)", // --color-warning-500
            "hsl(35, 100%, 58%)", // --color-warning-600
            "hsl(35, 100%, 66%)", // --color-warning-700
            "hsl(35, 93%, 65%)", // --color-warning-800
            "hsl(35, 100%, 72%)", // --color-warning-900
            "hsl(35, 100%, 80%)", // --color-warning-1000
          ],
        },
        success: {
          baseColor: "#1A9338",
          shades: [
            "hsl(132, 42%, 9%)", // --color-success-100
            "hsl(130, 41%, 14%)", // --color-success-200
            "hsl(131, 41%, 18%)", // --color-success-300
            "hsl(132, 41%, 22%)", // --color-success-400
            "hsl(131, 41%, 44%)", // --color-success-500
            "hsl(131, 41%, 48%)", // --color-success-600
            "hsl(131, 41%, 54%)", // --color-success-700
            "hsl(131, 34%, 70%)", // --color-success-800
            "hsl(131, 34%, 76%)", // --color-success-900
            "hsl(130, 35%, 83%)", // --color-success-1000
          ],
        },
        lightness: 0,
        saturation: 100,
      },
    },
  },
  {
    id: "dotui",
    name: "dotUI",
    defaultMode: "dark",
    fonts: {
      heading: "inter",
      body: "inter",
    },
    radius: 0.5,
    iconLibrary: "lucide",
    variants: {
      loader: "loader-ring",
      button: "button-02",
      calendar: "calendar-02",
    },
    colors: {
      light: {
        neutral: {
          baseColor: "#ffffff",
          shades: [
            "hsl(0, 0%, 98%)",
            "hsl(0, 0%, 94%)",
            "hsl(0, 0%, 90%)",
            "hsl(0, 0%, 85%)",
            "hsl(0, 0%, 80%)",
            "hsl(0, 0%, 40%)",
            "hsl(0, 0%, 35%)",
            "hsl(0, 0%, 28%)",
            "hsl(0, 0%, 16%)",
            "hsl(0, 0%, 12%)",
          ],
        },
        accent: {
          baseColor: "#0091FF",
          shades: [
            "hsl(210, 100%, 88%)",
            "hsl(210, 100%, 81%)",
            "hsl(210, 100%, 74%)",
            "hsl(210, 100%, 67%)",
            "hsl(210, 64%, 55%)",
            "hsl(210, 51%, 44%)",
            "hsl(210, 51%, 36%)",
            "hsl(210, 52%, 29%)",
            "hsl(211, 52%, 17%)",
            "hsl(211, 52%, 12%)",
          ],
        },
        danger: {
          baseColor: "#D93036",
          shades: [
            "hsl(358, 69%, 90%)",
            "hsl(358, 69%, 85%)",
            "hsl(358, 70%, 79%)",
            "hsl(358, 69%, 73%)",
            "hsl(358, 69%, 63%)",
            "hsl(358, 64%, 49%)",
            "hsl(358, 63%, 41%)",
            "hsl(358, 64%, 33%)",
            "hsl(357, 64%, 20%)",
            "hsl(358, 65%, 15%)",
          ],
        },
        warning: {
          baseColor: "#E79D13",
          shades: [
            "hsl(35, 100%, 80%)",
            "hsl(35, 100%, 69%)",
            "hsl(35, 100%, 58%)",
            "hsl(35, 93%, 49%)",
            "hsl(35, 92%, 41%)",
            "hsl(35, 93%, 32%)",
            "hsl(35, 93%, 26%)",
            "hsl(35, 93%, 22%)",
            "hsl(35, 94%, 12%)",
            "hsl(36, 91%, 9%)",
          ],
        },
        success: {
          baseColor: "#1A9338",
          shades: [
            "hsl(130, 34%, 83%)",
            "hsl(131, 35%, 75%)",
            "hsl(131, 35%, 66%)",
            "hsl(132, 35%, 56%)",
            "hsl(131, 41%, 43%)",
            "hsl(132, 41%, 34%)",
            "hsl(132, 41%, 28%)",
            "hsl(131, 41%, 23%)",
            "hsl(131, 40%, 13%)",
            "hsl(132, 42%, 9%)",
          ],
        },
        lightness: 100,
        saturation: 100,
      },
      dark: {
        neutral: {
          baseColor: "hsl(228, 44.93%, 10.35%)",
          shades: [
            "hsl(232, 34%, 13%)",
            "hsl(231, 20%, 20%)",
            "hsl(230, 13%, 27%)",
            "hsl(229, 10%, 34%)",
            "hsl(228, 7%, 43%)",
            "hsl(230, 5%, 54%)",
            "hsl(233, 5%, 62%)",
            "hsl(233, 5%, 71%)",
            "hsl(225, 6%, 88%)",
            "hsl(240, 6%, 94%)",
          ],
        },
        success: {
          baseColor: "hsl(134.88, 44.93%, 48.99%)",
          shades: [
            "hsl(135, 45%, 14%)",
            "hsl(135, 45%, 17%)",
            "hsl(135, 45%, 21%)",
            "hsl(136, 45%, 25%)",
            "hsl(135, 45%, 32%)",
            "hsl(135, 45%, 41%)",
            "hsl(135, 45%, 48%)",
            "hsl(135, 43%, 60%)",
            "hsl(135, 44%, 84%)",
            "hsl(133, 43%, 92%)",
          ],
        },
        warning: {
          baseColor: "#E79D13",
          shades: [
            "hsl(39, 84%, 13%)",
            "hsl(39, 85%, 16%)",
            "hsl(39, 84%, 20%)",
            "hsl(39, 85%, 23%)",
            "hsl(39, 84%, 30%)",
            "hsl(39, 85%, 38%)",
            "hsl(39, 85%, 44%)",
            "hsl(39, 82%, 53%)",
            "hsl(39, 83%, 82%)",
            "hsl(39, 83%, 91%)",
          ],
        },
        danger: {
          baseColor: "#D93036",
          shades: [
            "hsl(358, 64%, 21%)",
            "hsl(358, 64%, 26%)",
            "hsl(358, 64%, 31%)",
            "hsl(358, 64%, 37%)",
            "hsl(358, 63%, 47%)",
            "hsl(358, 69%, 61%)",
            "hsl(358, 69%, 70%)",
            "hsl(359, 69%, 77%)",
            "hsl(356, 70%, 91%)",
            "hsl(356, 68%, 95%)",
          ],
        },
        accent: {
          baseColor: "hsl(125, 34.23%, 36.5%)",
          shades: [
            "hsl(125, 34%, 14%)",
            "hsl(126, 34%, 18%)",
            "hsl(126, 35%, 22%)",
            "hsl(125, 34%, 27%)",
            "hsl(126, 34%, 34%)",
            "hsl(126, 22%, 46%)",
            "hsl(126, 19%, 57%)",
            "hsl(125, 19%, 66%)",
            "hsl(128, 21%, 86%)",
            "hsl(129, 19%, 93%)",
          ],
        },
        lightness: 9,
        saturation: 100,
      },
    },
  },
  {
    id: "retro",
    name: "Retro",
    defaultMode: "light",
    fonts: {
      heading: "inter",
      body: "josefin",
    },
    radius: 0,
    iconLibrary: "lucide",
    variants: {
      button: "button-02",
      calendar: "calendar-01",
    },
    colors: {
      light: {
        neutral: {
          baseColor: "hsla(0, 0%, 99%, 1)",
          shades: [
            "hsl(0, 0%, 97%)",
            "hsl(0, 0%, 90%)",
            "hsl(0, 0%, 78%)",
            "hsl(0, 0%, 68%)",
            "hsl(0, 0%, 56%)",
            "hsl(0, 0%, 45%)",
            "hsl(0, 0%, 37%)",
            "hsl(0, 0%, 31%)",
            "hsl(0, 0%, 19%)",
            "hsl(0, 0%, 15%)",
          ],
        },
        success: {
          baseColor: "#1A9338",
          shades: [
            "hsl(136, 37%, 88%)",
            "hsl(134, 35%, 79%)",
            "hsl(135, 36%, 70%)",
            "hsl(135, 36%, 60%)",
            "hsl(135, 46%, 44%)",
            "hsl(135, 70%, 30%)",
            "hsl(135, 69%, 25%)",
            "hsl(135, 70%, 21%)",
            "hsl(134, 70%, 13%)",
            "hsl(135, 69%, 10%)",
          ],
        },
        warning: {
          baseColor: "#E79D13",
          shades: [
            "hsl(39, 81%, 86%)",
            "hsl(39, 82%, 74%)",
            "hsl(39, 82%, 63%)",
            "hsl(39, 82%, 50%)",
            "hsl(39, 85%, 41%)",
            "hsl(39, 84%, 33%)",
            "hsl(39, 84%, 27%)",
            "hsl(39, 84%, 23%)",
            "hsl(39, 86%, 14%)",
            "hsl(38, 85%, 11%)",
          ],
        },
        danger: {
          baseColor: "#D93036",
          shades: [
            "hsl(358, 68%, 93%)",
            "hsl(359, 69%, 87%)",
            "hsl(357, 70%, 82%)",
            "hsl(358, 69%, 76%)",
            "hsl(358, 69%, 66%)",
            "hsl(358, 68%, 52%)",
            "hsl(358, 64%, 43%)",
            "hsl(358, 64%, 36%)",
            "hsl(358, 63%, 22%)",
            "hsl(357, 64%, 18%)",
          ],
        },
        accent: {
          baseColor: "#0091FF",
          shades: [
            "hsl(206, 100%, 90%)",
            "hsl(206, 100%, 83%)",
            "hsl(206, 100%, 75%)",
            "hsl(206, 100%, 66%)",
            "hsl(206, 100%, 51%)",
            "hsl(206, 100%, 40%)",
            "hsl(206, 100%, 34%)",
            "hsl(206, 100%, 28%)",
            "hsl(206, 100%, 17%)",
            "hsl(206, 100%, 14%)",
          ],
        },
        lightness: 100,
        saturation: 100,
      },
      dark: {
        neutral: {
          baseColor: "#000000",
          shades: [
            "hsl(240, 6%, 8%)",
            "hsl(240, 6%, 13%)",
            "hsl(240, 6%, 19%)",
            "hsl(240, 6%, 25%)",
            "hsl(240, 6%, 33%)",
            "hsl(240, 6%, 47%)",
            "hsl(240, 6%, 55%)",
            "hsl(240, 6%, 70%)",
            "hsl(240, 6%, 85%)",
            "hsl(240, 10%, 98%)",
          ],
        },
        accent: {
          baseColor: "#0091FF",
          shades: [
            "hsl(211, 51%, 12%)",
            "hsl(211, 52%, 18%)",
            "hsl(210, 52%, 29%)",
            "hsl(209, 51%, 40%)",
            "hsl(210, 52%, 48%)",
            "hsl(210, 51%, 55%)",
            "hsl(210, 68%, 62%)",
            "hsl(210, 97%, 71%)",
            "hsl(210, 100%, 82%)",
            "hsl(210, 100%, 87%)",
          ],
        },
        danger: {
          baseColor: "#D93036",
          shades: [
            "hsl(357, 64%, 14%)",
            "hsl(358, 64%, 21%)",
            "hsl(358, 64%, 26%)",
            "hsl(358, 64%, 32%)",
            "hsl(358, 64%, 42%)",
            "hsl(358, 69%, 51%)",
            "hsl(358, 69%, 60%)",
            "hsl(358, 69%, 70%)",
            "hsl(359, 70%, 86%)",
            "hsl(358, 69%, 90%)",
          ],
        },
        warning: {
          baseColor: "#E79D13",
          shades: [
            "hsl(34, 100%, 10%)",
            "hsl(34, 100%, 20%)",
            "hsl(35, 100%, 40%)",
            "hsl(35, 100%, 48%)",
            "hsl(35, 100%, 50%)",
            "hsl(35, 100%, 58%)",
            "hsl(35, 100%, 66%)",
            "hsl(35, 93%, 65%)",
            "hsl(35, 100%, 72%)",
            "hsl(35, 100%, 80%)",
          ],
        },
        success: {
          baseColor: "#1A9338",
          shades: [
            "hsl(132, 42%, 9%)",
            "hsl(130, 41%, 14%)",
            "hsl(131, 41%, 18%)",
            "hsl(132, 41%, 22%)",
            "hsl(131, 41%, 44%)",
            "hsl(131, 41%, 48%)",
            "hsl(131, 41%, 54%)",
            "hsl(131, 34%, 70%)",
            "hsl(131, 34%, 76%)",
            "hsl(130, 35%, 83%)",
          ],
        },
        lightness: 0,
        saturation: 100,
      },
    },
  },
];

// ----------------------------------------------------------------
// Default Theme
// ----------------------------------------------------------------

export const defaultTheme = dotUIThemes[0];
