import { Theme } from "@/types/theme";

export const dotUIThemes: Theme[] = [
  {
    id: "default",
    name: "Default",
    fonts: {
      heading: "inter",
      body: "josefin",
    },
    radius: 0.5,
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
];

// ----------------------------------------------------------------
// Default Theme
// ----------------------------------------------------------------

export const defaultTheme = dotUIThemes[0];
