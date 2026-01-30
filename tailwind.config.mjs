/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                // Cyberpunk-ish palette
                bg: '#0a0a0f', // Very dark blue/black
                surface: '#13131f', // Slightly lighter
                primary: '#00f0ff', // Cyan
                secondary: '#7000ff', // Violet
                accent: '#ff003c', // Red/Pink
                text: '#e0e0e0',
                muted: '#858595',
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
