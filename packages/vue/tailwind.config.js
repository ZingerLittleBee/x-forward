module.exports = {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    safelist: [
        'btn-primary',
        'btn-secondary',
        'btn-accent',
        'btn-info',
        'btn-success',
        'btn-warning',
        'btn-error',
        'btn-neutral',
        'badge-primary',
        'badge-secondary',
        'badge-accent',
        'badge-info',
        'badge-success',
        'badge-primary',
        'badge-warning',
        'badge-error',
        'badge-neutral'
    ],
    theme: {
        extend: {}
    },
    plugins: [require('@tailwindcss/typography'), require('daisyui')],
    daisyui: {
        themes: ['light', 'dark']
    }
}
