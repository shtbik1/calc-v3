/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
      boxShadow: {
        "custom-16dp": "0px 4px 16px 0px rgba(0, 0, 0, 0.1)",
      },
      screens: {
        "15xl": "1440px",
        xs: "300px",
        xsm: "375px",
      },
      spacing: {
        18: "18px",
        100: "100px",
      },
      colors: {
        badge: "#E8598D",
        green: "#13AC47",
        dark: "#1A1B1D",
        orange: {
          50: "#FFF7ED",
        },
        purple: {
          50: "#EEF0FF",
          100: "#C9CAE9",
          500: "#4F55F1",
        },
        blue600: "#474CD8",
        blue700: "#3F44C0",
        pagebg: "#F6F6F6",
        sky500: "#0EA5E9",
        sky600: "#0c94d1",
        emerald500: "#1BC070",
        emerald600: "#11A85F",
        valencia300: "#F2AFAF",
        valencia500: "#D84949",
        valencia600: "#C73B3B",
        darkgray800: "#1F2937",
        gray300: "#D1D5DB",
        gray600: "#4B5563",
        gray700: "#374151",
        gray800: "#1F2937",
        white: "#FFFFFF",
        separator: "#D1D5DB",
        steps: "#4B5563",
        smalltext: "#737888",
        headerborder: "#D1D5DB",
        sidebar: "#EAEDEF",
        check: "#15803D",
        red: "#D84949",
        buttondisabled: "#F3F4F6",
      },
      fontSize: {
        13: "13px",
        15: "15px",
        19: "19px",
        22: "22px",
        32: "32px",
      },
      borderRadius: {
        18: "18px",
        28: "28px",
      },
      maxWidth: {
        mobileL: "425px",
        344: "344px",
        505: "505px",
      },
      maxHeight: { 344: "344px" },
      width: {
        104: "104px",
        86: "21.5rem",
        400: "400px",
        344: "344px",
      },
      height: {
        68: "68px",
        22: "5.5rem", // 88px
      },
      // fontFamily: {
      //   sans: ["var(--font-sans)", ...fontFamily.sans],
      // },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config
