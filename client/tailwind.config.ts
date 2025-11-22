import type { Config } from "tailwindcss";
import sharedConfig from "../tailwind.config";

export default {
  ...sharedConfig,
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
} satisfies Config;
