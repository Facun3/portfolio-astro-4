/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			keyframes: {
			  scroll: {
				'0%': { transform: 'translateX(0)' },
				'100%': { transform: 'translateX(-100%)' },
			  },
			},
			animation: {
			  scroll: 'scroll 20s linear infinite',
			},
		  },
	},
	plugins: [],
	darkMode: 'class',
}
