import { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

import { shadcnPlugin } from "./src/lib/shadcn-plugin";

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [tailwindAnimate, shadcnPlugin],
  darkMode: "class",
  theme:{
    extend:{
      screens:{
        // 기본 브레이크포인트
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',

        // max- 브레이크포인트
        'max-xs': { 'max': '479px' },
        'max-sm': { 'max': '639px' },
        'max-md': { 'max': '767px' },
        'max-lg': { 'max': '1023px' },
        'max-xl': { 'max': '1279px' },
        'max-2xl': { 'max': '1535px' },
      }
    }
  }
} satisfies Config;


export default config;