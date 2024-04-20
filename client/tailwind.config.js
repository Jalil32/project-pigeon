/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{tsx, ts, js, jsx}'],
    theme: {
        extend: {
            borderRadius: {
                theme: {
                    large: '25px',
                },
            },

            fontFamily: {
                noto: ['noto sans', 'sans-serif'],
            },
        },
        animation: {
            shine: 'shine 1s',
        },
        keyframes: {
            shine: {
                '100%': { left: '125%' },
            },
        },
    },
    plugins: [],
}
