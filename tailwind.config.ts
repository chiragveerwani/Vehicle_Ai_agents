// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
content: [
"./app//*.{js,ts,jsx,tsx}",
"./components//*.{js,ts,jsx,tsx}",
],
theme: {
extend: {
keyframes: {
'car-drive': {
'0%': { transform: 'translateX(100vw)' },
'100%': { transform: 'translateX(-200px)' },
},
},
animation: {
'car-entry': 'car-drive 3s ease-in-out forwards',
},
},
},
plugins: [],
};

export default config;