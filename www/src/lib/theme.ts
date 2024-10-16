import type { Theme } from "@/types/theme";

export const defaultTheme: Theme = {
  light: {
    palettes: {
      neutral: {
        baseColors: ["#000000"],
        ratios: [1, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
        smooth: true,
        lightness: 97,
        saturation: 100,
        colors: {
          "100": "hsl(0, 0%, 96%)",
          "200": "hsl(0, 0%, 88%)",
          "300": "hsl(0, 0%, 79%)",
          "400": "hsl(0, 0%, 66%)",
          "500": "hsl(0, 0%, 54%)",
          "600": "hsl(0, 0%, 51%)",
          "700": "hsl(0, 0%, 48%)",
          "800": "hsl(0, 0%, 45%)",
          "900": "hsl(0, 0%, 16%)",
          "1000": "hsl(0, 0%, 12%)",
        },
      },
      primary: {
        baseColors: ["#ffffff"],
        smooth: true,
        lightness: 97,
        saturation: 100,
        ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
        colors: {
          "100": "hsl(0, 0%, 87%)",
          "200": "hsl(0, 0%, 79%)",
          "300": "hsl(0, 0%, 73%)",
          "400": "hsl(0, 0%, 65%)",
          "500": "hsl(0, 0%, 54%)",
          "600": "hsl(0, 0%, 42%)",
          "700": "hsl(0, 0%, 35%)",
          "800": "hsl(0, 0%, 28%)",
          "900": "hsl(0, 0%, 16%)",
          "1000": "hsl(0, 0%, 12%)",
        },
      },
      success: {
        baseColors: ["#1A9338"],
        smooth: true,
        lightness: 97,
        saturation: 100,
        ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
        colors: {
          "100": "hsl(130, 34%, 83%)",
          "200": "hsl(131, 35%, 75%)",
          "300": "hsl(131, 35%, 66%)",
          "400": "hsl(132, 35%, 56%)",
          "500": "hsl(131, 41%, 43%)",
          "600": "hsl(132, 41%, 34%)",
          "700": "hsl(132, 41%, 28%)",
          "800": "hsl(131, 41%, 23%)",
          "900": "hsl(131, 40%, 13%)",
          "1000": "hsl(132, 42%, 9%)",
        },
      },
      warning: {
        baseColors: ["#E79D13"],
        smooth: true,
        lightness: 97,
        saturation: 100,
        ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
        colors: {
          "100": "hsl(35, 100%, 80%)",
          "200": "hsl(35, 100%, 69%)",
          "300": "hsl(35, 100%, 58%)",
          "400": "hsl(35, 93%, 49%)",
          "500": "hsl(35, 92%, 41%)",
          "600": "hsl(35, 93%, 32%)",
          "700": "hsl(35, 93%, 26%)",
          "800": "hsl(35, 93%, 22%)",
          "900": "hsl(35, 94%, 12%)",
          "1000": "hsl(36, 91%, 9%)",
        },
      },
      danger: {
        baseColors: ["#D93036"],
        smooth: true,
        lightness: 97,
        saturation: 100,
        ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
        colors: {
          "100": "hsl(358, 69%, 90%)",
          "200": "hsl(358, 69%, 85%)",
          "300": "hsl(358, 70%, 79%)",
          "400": "hsl(358, 69%, 73%)",
          "500": "hsl(358, 69%, 63%)",
          "600": "hsl(358, 64%, 49%)",
          "700": "hsl(358, 63%, 41%)",
          "800": "hsl(358, 64%, 33%)",
          "900": "hsl(357, 64%, 20%)",
          "1000": "hsl(358, 65%, 15%)",
        },
      },
      accent: {
        baseColors: ["#0091FF"],
        smooth: true,
        lightness: 97,
        saturation: 100,
        ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
        colors: {
          "100": "hsl(210, 100%, 88%)",
          "200": "hsl(210, 100%, 81%)",
          "300": "hsl(210, 100%, 74%)",
          "400": "hsl(210, 100%, 67%)",
          "500": "hsl(210, 64%, 55%)",
          "600": "hsl(210, 51%, 44%)",
          "700": "hsl(210, 51%, 36%)",
          "800": "hsl(210, 52%, 29%)",
          "900": "hsl(211, 52%, 17%)",
          "1000": "hsl(211, 52%, 12%)",
        },
      },
    },
  },
  dark: {
    palettes: {
      neutral: {
        baseColors: ["#ffffff"],
        smooth: true,
        lightness: 0,
        saturation: 100,
        ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
        colors: {
          "100": "hsl(0, 0%, 1%)",
          "200": "hsl(0, 0%, 17%)",
          "300": "hsl(0, 0%, 22%)",
          "400": "hsl(0, 0%, 27%)",
          "500": "hsl(0, 0%, 36%)",
          "600": "hsl(0, 0%, 47%)",
          "700": "hsl(0, 0%, 55%)",
          "800": "hsl(0, 0%, 64%)",
          "900": "hsl(0, 0%, 80%)",
          "1000": "hsl(0, 0%, 86%)",
        },
      },
      primary: {
        baseColors: ["#000000"],
        smooth: true,
        lightness: 0,
        saturation: 100,
        ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
        colors: {
          "100": "hsl(0, 0%, 12%)",
          "200": "hsl(0, 0%, 17%)",
          "300": "hsl(0, 0%, 22%)",
          "400": "hsl(0, 0%, 27%)",
          "500": "hsl(0, 0%, 36%)",
          "600": "hsl(0, 0%, 47%)",
          "700": "hsl(0, 0%, 55%)",
          "800": "hsl(0, 0%, 64%)",
          "900": "hsl(0, 0%, 80%)",
          "1000": "hsl(0, 0%, 86%)",
        },
      },
      success: {
        baseColors: ["#1A9338"],
        smooth: true,
        lightness: 0,
        saturation: 100,
        ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
        colors: {
          "100": "hsl(132, 42%, 9%)",
          "200": "hsl(130, 41%, 14%)",
          "300": "hsl(131, 41%, 18%)",
          "400": "hsl(132, 41%, 22%)",
          "500": "hsl(131, 41%, 29%)",
          "600": "hsl(131, 41%, 38%)",
          "700": "hsl(131, 41%, 45%)",
          "800": "hsl(131, 34%, 55%)",
          "900": "hsl(131, 34%, 76%)",
          "1000": "hsl(130, 35%, 83%)",
        },
      },
      warning: {
        baseColors: ["#E79D13"],
        smooth: true,
        lightness: 0,
        saturation: 100,
        ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
        colors: {
          "100": "hsl(34, 91%, 9%)",
          "200": "hsl(34, 91%, 13%)",
          "300": "hsl(35, 93%, 17%)",
          "400": "hsl(35, 92%, 21%)",
          "500": "hsl(35, 93%, 27%)",
          "600": "hsl(35, 92%, 35%)",
          "700": "hsl(35, 92%, 42%)",
          "800": "hsl(35, 93%, 48%)",
          "900": "hsl(35, 100%, 72%)",
          "1000": "hsl(35, 100%, 80%)",
        },
      },
      danger: {
        baseColors: ["#D93036"],
        smooth: true,
        lightness: 0,
        saturation: 100,
        ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
        colors: {
          "100": "hsl(357, 64%, 14%)",
          "200": "hsl(358, 64%, 21%)",
          "300": "hsl(358, 64%, 26%)",
          "400": "hsl(358, 64%, 32%)",
          "500": "hsl(358, 64%, 42%)",
          "600": "hsl(358, 69%, 55%)",
          "700": "hsl(358, 69%, 65%)",
          "800": "hsl(358, 69%, 72%)",
          "900": "hsl(359, 70%, 86%)",
          "1000": "hsl(358, 69%, 90%)",
        },
      },
      accent: {
        baseColors: ["#0091FF"],
        smooth: true,
        lightness: 0,
        saturation: 100,
        ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
        colors: {
          "100": "hsl(211, 51%, 12%)",
          "200": "hsl(211, 52%, 18%)",
          "300": "hsl(210, 52%, 23%)",
          "400": "hsl(209, 51%, 28%)",
          "500": "hsl(210, 52%, 37%)",
          "600": "hsl(210, 51%, 48%)",
          "700": "hsl(210, 68%, 57%)",
          "800": "hsl(210, 85%, 65%)",
          "900": "hsl(210, 100%, 82%)",
          "1000": "hsl(210, 100%, 87%)",
        },
      },
    },
  },
  radius: "0.5", // in rem
};
